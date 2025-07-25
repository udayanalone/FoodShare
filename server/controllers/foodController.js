// foodController.js
const FoodItem = require('../models/FoodItem');

exports.getAllFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createFoodItem = async (req, res) => {
  try {
    const newItem = new FoodItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}; 