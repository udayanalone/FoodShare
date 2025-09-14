// foodController.js
const Food = require('../models/Food');
const { getNotificationService } = require('./notificationController');

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

// Advanced search with filters
exports.searchFoodItems = async (req, res) => {
  try {
    const {
      query,
      category,
      location,
      expiryDays,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build search criteria
    let searchCriteria = { isAvailable: true };

    // Text search in title and description
    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      searchCriteria.category = category;
    }

    // Location filter
    if (location) {
      searchCriteria.location = { $regex: location, $options: 'i' };
    }

    // Expiry date filter
    if (expiryDays) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + parseInt(expiryDays));
      searchCriteria.expiryDate = { $lte: futureDate };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const foods = await Food.find(searchCriteria)
      .populate('donor', 'name email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Food.countDocuments(searchCriteria);

    res.json({
      foods,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get nearby food items (requires coordinates)
exports.getNearbyFoodItems = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // For now, we'll do a simple location text search
    // In production, you'd want to use MongoDB's geospatial queries
    const foods = await Food.find({ isAvailable: true })
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get food categories with counts
exports.getFoodCategories = async (req, res) => {
  try {
    const categories = await Food.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(categories);
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

    // Notify nearby users (simplified - in production you'd use geolocation)
    const notificationService = getNotificationService();
    if (notificationService) {
      // For demo, we'll skip nearby user notification
      // In production, you'd query users within a radius
    }

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

    // Send notification to donor
    const notificationService = getNotificationService();
    if (notificationService) {
      try {
        await notificationService.notifyFoodClaimed(food, req.user);
      } catch (error) {
        console.error('Error sending claim notification:', error);
      }
    }

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