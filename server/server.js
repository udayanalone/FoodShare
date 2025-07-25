const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB before processing requests
let isConnected = false;
const connectToDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

app.use(async (req, res, next) => {
  await connectToDB();
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Food Surplus API is running!' });
});

// No need for app.listen() in a serverless environment
// The PORT constant is also not needed

module.exports = app;