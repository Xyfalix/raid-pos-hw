const Fruit = require("../../models/fruit");

const getAllFruits = async (req, res) => {
  try {
    // retrieve all fruit "documents"
    const fruits = await Fruit.find({});
    res.json(fruits);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve fruit list" });
  }
};

const addFruit = async (req, res) => {
  try {
    const newFruitData = req.body;

    // check if item with same itemId exists in database
    const checkExisting = await Fruit.findOne({ fruitName: newFruitData.fruitName });

    if (checkExisting) {
      return res
        .status(400)
        .json({ error: "This fruit already exists in the database" });
    }

    const newFruit = await Fruit.create(newFruitData);
    res.status(201).json(newFruit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add fruit to database" });
  }
};

module.exports = {
  getAllFruits,
  addFruit,
};