// foodController.js
const Food = require('../models/Food');

exports.getAllFoodItems = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true })
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createFoodItem = async (req, res) => {
  try {
    const { title, description, quantity, category, expiryDate, location, imageUrl } = req.body;

    const food = new Food({
      title,
      description,
      quantity,
      category,
      expiryDate,
      location,
      imageUrl: imageUrl || '',
      donor: req.user._id
    });

    await food.save();
    await food.populate('donor', 'name email phone');

    res.status(201).json({
      message: 'Food item created successfully',
      food
    });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
};

// Get user's donated food items
exports.getMyDonations = async (req, res) => {
  try {
    const foods = await Food.find({ donor: req.user._id })
      .populate('claimedBy', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's claimed food items
exports.getMyClaims = async (req, res) => {
  try {
    const foods = await Food.find({ claimedBy: req.user._id })
      .populate('donor', 'name email phone')
      .sort({ claimedAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Claim food item
exports.claimFoodItem = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (!food.isAvailable) {
      return res.status(400).json({ message: 'Food item is no longer available' });
    }

    if (food.donor.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot claim your own donation' });
    }

    food.isAvailable = false;
    food.claimedBy = req.user._id;
    food.claimedAt = new Date();

    await food.save();
    await food.populate('donor', 'name email phone');
    await food.populate('claimedBy', 'name email phone');

    res.json({
      message: 'Food item claimed successfully',
      food
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete food item
exports.deleteFoodItem = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Food.deleteOne({ _id: req.params.id, donor: req.user._id });

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};