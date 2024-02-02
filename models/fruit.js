const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema(
  {
    fruitName: {
      type: String,
      unique: true,
      required: true,
    },
    fruitPrice: {
      type: Number,
      required: true,
    },
    fruitImage: {
      type: String,
      required: true,
    },
    availableStock: {
      type: Number,
      required: true,
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

const Fruit = mongoose.model("Fruit", fruitSchema);

module.exports = Fruit;
