const Fruit = require("../../models/fruit");
const Order = require("../../models/order");

const getAllOrders = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userOrders = await Order.find({ user: userId })
      .populate([
        { path: "lineItems", select: "qty" },
        { path: "lineItems.item", select: "itemPrice" },
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
      .populate("lineItems.item")
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
        cartWithExtPrice, // Include line items with extPrice
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
  const itemId = req.params.itemId;
  const itemQty = req.params.itemQty;
  try {
    // populate line items in cart
    const cart = await Order.findOne({
      orderStatus: "pending payment",
      user: userId,
    })
      .populate("lineItems.item")
      .exec();

    if (cart) {
      const lineItem = cart.lineItems.find(
        (lineItem) => lineItem.item.itemId === itemId,
      );
      // set line item qty to specified value
      if (lineItem && itemQty > 0) {
        lineItem.qty = itemQty;
        await cart.save();
        return res.status(200).json(lineItem);
      } else {
        return res.status(400).json({ error: "item not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "unable to set item qty" });
  }
};

const addToCart = async (req, res) => {
  const addedQty = parseInt(req.params.addedQty);
  const userId = res.locals.userId;
  const fruitData = req.body;
  console.log(typeof addedQty);


  console.log(`fruit name is ${fruitData.fruitName}`);
  console.log(`fruit image is ${fruitData.fruitImage}`);
  console.log(`fruit price is ${fruitData.fruitPrice}`)

  try {
    const cart = await Order.findOne({
      orderStatus: "pending payment",
      user: userId,
    })
      .populate("lineItems.item")
      .exec();

    if (cart) {
      // check if item exists in cart and add qty if it exists
      const existingItem = cart.lineItems.find(
        (lineItem) => lineItem.fruit.fruitName === fruitData.fruitName,
      );

      if (existingItem) {
        console.log(typeof existingItem.qty);
        existingItem.qty += addedQty;
      } else {
        cart.lineItems.push({ fruit, qty: addedQty });
      }
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // create a new order and add item to order
      let fruit = await Fruit.findOne({ fruitName });
      if (!fruit) {
        // create a new item document using card info
        console.log("Creating card item");
        fruit = await Fruit.create(fruitData);
        await fruit.save();
      }

      const newOrder = await Order.create({
        user: userId,
        lineItems: [{ fruit: fruit._id, qty: addedQty }],
      });
      await newOrder.save();
      return res.status(201).json(newOrder);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to add item to cart" });
  }
};

const deleteItemFromCart = async (req, res) => {
  const userId = res.locals.userId;
  const itemId = req.params.itemId;

  console.log(`cardId is ${itemId}`);

  try {
    const cart = await Order.findOne({
      orderStatus: "pending payment",
      user: userId,
    })
      .populate("lineItems.item")
      .exec();

    if (!cart) {
      return res.status(404).json({ error: "cart not found" });
    }

    const itemIndex = cart.lineItems.findIndex(
      (lineItem) => lineItem.item.itemId === itemId,
    );

    console.log(`item index is ${itemIndex}`);

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in order" });
    }

    cart.lineItems.splice(itemIndex, 1);

    console.log(`cart lineitems is ${cart.lineItems}`);

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
    });
    cart.orderStatus = "paid";
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: "Unable to checkout cart" });
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
