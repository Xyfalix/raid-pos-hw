const mongoose = require("mongoose");
const User = require("./user");
const Fruit = require("./fruit");

const lineItemSchema = new mongoose.Schema(
  {
    qty: {
      type: Number,
      required: true,
      default: 1,
    },
    fruit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Fruit,
      required: true,
    },
  },
  {
    timestamps: true,
    toJson: { virtuals: true },
  },
);

lineItemSchema.virtual("extPrice").get(function () {
  // Check if item is populated
  if (this.fruit && this.fruit.fruitPrice) {
    return this.qty * this.fruit.fruitPrice;
  } else { // Handle cases where fruit does not exist or price is missing - to replace with error indication
    return 0; 
  }
});

const orderSchema = new mongoose.Schema(
  {
    lineItems: [lineItemSchema],
    orderStatus: {
      type: String,
      required: true,
      default: "pending payment",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
    toJson: { virtuals: true },
  },
);

orderSchema.virtual("orderTotal").get(function () {
  return this.lineItems.reduce((total, fruit) => total + fruit.extPrice, 0);
});

orderSchema.virtual("totalQty").get(function () {
  return this.lineItems.reduce((total, fruit) => total + fruit.qty, 0);
});

orderSchema.virtual("orderId").get(function () {
  return this.id.slice(-6).toUpperCase();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
