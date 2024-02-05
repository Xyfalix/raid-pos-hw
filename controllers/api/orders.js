const Fruit = require("../../models/fruit");
const Order = require("../../models/order");

const getAllOrders = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userOrders = await Order.find({ user: userId })
      .populate([
        { path: "lineItems", select: "qty" },
        { path: "lineItems.fruit", select: "fruitPrice" },
      ])
      .exec();

    if (userOrders) {
      const ordersWithSummary = userOrders.map((order) => {
        const orderTotal = order.orderTotal;
        const totalQty = order.totalQty;
        const orderId = order.orderId;

        return {
          ...order.toObject(),
          orderTotal,
          totalQty,
          orderId,
        };
      });

      return res.status(200).json(ordersWithSummary);
    } else {
      return res.status(200).json({ message: "Order history is empty" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Unable to retrieve order summary" });
  }
};

const getCart = async (req, res) => {
  const userId = res.locals.userId;
  // look for order with pending payment order status and userId
  try {
    const cart = await Order.findOne({
      orderStatus: "pending payment",
      user: userId,
    })
      .populate("lineItems.fruit")
      .exec();
    // return cart if it exists
    if (cart) {
      // Calculate orderTotal and totalQty from line items
      const orderTotal = cart.orderTotal;
      const totalQty = cart.totalQty;
      const orderId = cart.orderId;

      // Access the extPrice virtual for each line item
      const cartWithExtPrice = cart.lineItems.map((lineItem) => ({
        ...lineItem.toObject(),
        extPrice: lineItem.extPrice,
      }));

      return res.status(200).json({
        cartWithExtPrice, // extPrice is the base price of the item * qty selected
        orderTotal,
        totalQty,
        orderId,
      });
    } else {
      // inform user that cart is empty
      return res.status(200).json({ message: "Your cart is empty!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Unable to get cart" });
  }
};

const setItemQtyInCart = async (req, res) => {
  const userId = res.locals.userId;
  const fruitName = req.params.fruitName;
  const itemQty = req.params.itemQty;
  try {
    // populate line items in cart
    const cart = await Order.findOne({
      orderStatus: "pending payment",
      user: userId,
    })
      .populate("lineItems.fruit")
      .exec();

    if (cart) {
      const lineItem = cart.lineItems.find(
        (lineItem) => lineItem.fruit.fruitName === fruitName,
      );
      // set line item qty to specified value
      if (lineItem && itemQty > 0) {
        lineItem.qty = itemQty;
        await cart.save();
        return res.status(200).json(lineItem);
      } else {
        return res.status(400).json({ error: "fruit not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "unable to set fruit qty" });
  }
};

const addToCart = async (req, res) => {
  const fruitName = req.params.fruitName
  const addedQty = parseInt(req.params.addedQty);
  const userId = res.locals.userId;

  try {
    const cart = await Order.findOne({
      orderStatus: "pending payment",
      user: userId,
    })
      .populate("lineItems.fruit")
      .exec();

    if (cart) {
      // check if item exists in cart and add qty if it exists
      const existingItem = cart.lineItems.find(
        (lineItem) => lineItem.fruit.fruitName === fruitName,
      );

      if (existingItem) { // if fruit exists, add added qty to its current value
        existingItem.qty += addedQty;
      } else { // add new fruit and addedQty to cart
        let fruit = await Fruit.findOne({ fruitName })
        cart.lineItems.push({ fruit, qty: addedQty });
      }
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // create a new order and add item to order if cart does not exist
      let fruit = await Fruit.findOne({ fruitName });
      const newOrder = await Order.create({
        user: userId,
        lineItems: [{ fruit, qty: addedQty }],
      });
      await newOrder.save();
      return res.status(201).json(newOrder);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to add fruit to cart" });
  }
};

const deleteItemFromCart = async (req, res) => {
  const userId = res.locals.userId;
  const fruitName = req.params.fruitName;

  try {
    const cart = await Order.findOne({
      orderStatus: "pending payment",
      user: userId,
    })
      .populate("lineItems.fruit")
      .exec();

    if (!cart) {
      return res.status(404).json({ error: "cart not found" });
    }

    const fruitIndex = cart.lineItems.findIndex(
      (lineItem) => lineItem.fruit.fruitName === fruitName,
    );

    if (fruitIndex === -1) {
      return res.status(404).json({ error: "Item not found in order" });
    }

    // remove specified fruit from cart
    cart.lineItems.splice(fruitIndex, 1);

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "something went wrong when trying to remove item from order",
    });
  }
};

const checkout = async (req, res) => {
  const userId = res.locals.userId;
  try {
    const cart = await Order.findOne({
      orderStatus: "pending payment",
      user: userId,
    })
      .populate("lineItems.fruit")
      .exec();

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    for (const lineItem of cart.lineItems) {
      const fruitName = lineItem.fruit.fruitName;
      const itemQty = lineItem.qty;

      // Call updateFruitQty for each item in the cart
      await updateFruitQty(fruitName, itemQty);
    }

    cart.orderStatus = "paid";
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: "Unable to checkout cart" });
  }
};

const updateFruitQty = async (fruitName, itemQty) => {
  try {
    const fruit = await Fruit.findOne({
      fruitName: fruitName,
    });

    if (fruit) {
      if (fruit.availableStock - itemQty >= 0) {
        fruit.availableStock -= itemQty;
        await fruit.save();
        return fruit; // Return the updated fruit
      } else {
        throw new Error("Amount being purchased is less than amount available!");
      }
    } else {
      throw new Error("Fruit not found");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to update available stock");
  }
};

module.exports = {
  getAllOrders,
  getCart,
  setItemQtyInCart,
  addToCart,
  deleteItemFromCart,
  checkout,
};
