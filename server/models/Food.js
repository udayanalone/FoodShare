// server/models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'prepared', 'other']
  },
  expiryDate: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Food', foodSchema);