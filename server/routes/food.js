// server/routes/food.js
const express = require('express');
const foodController = require('../controllers/foodController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all available food items
router.get('/', foodController.getAllFoodItems);

// Create food item
router.post('/', auth, foodController.createFoodItem);

// Get user's donated food items
router.get('/my-donations', auth, foodController.getMyDonations);

// Get user's claimed food items
router.get('/my-claims', auth, foodController.getMyClaims);

// Claim food item
router.patch('/:id/claim', auth, foodController.claimFoodItem);

// Delete food item (only by donor)
router.delete('/:id', auth, foodController.deleteFoodItem);

module.exports = router;