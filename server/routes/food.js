// server/routes/food.js
const express = require('express');
const Food = require('../models/Food');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all available food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true })
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create food item
router.post('/', auth, async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's donated food items
router.get('/my-donations', auth, async (req, res) => {
  try {
    const foods = await Food.find({ donor: req.user._id })
      .populate('claimedBy', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's claimed food items
router.get('/my-claims', auth, async (req, res) => {
  try {
    const foods = await Food.find({ claimedBy: req.user._id })
      .populate('donor', 'name email phone')
      .sort({ claimedAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Claim food item
router.patch('/:id/claim', auth, async (req, res) => {
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
});

// Delete food item (only by donor)
router.delete('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;