const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');

const app = express();

// --- Robust CORS setup for Vercel ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://food-share-udayanalone83-gmailcom.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle preflight
// --- End CORS setup ---

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

// MongoDB connection - Updated to match your Atlas cluster
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://usalone370122:alone2004@server.fpv41av.mongodb.net/foodshare?retryWrites=true&w=majority";

// Connect to MongoDB before processing requests
let isConnected = false;
const connectToDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection error:', error.message);
    console.log('Connection string used:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    throw new Error('Failed to connect to MongoDB');
  }
};

app.use(async (req, res, next) => {
  try {
    await connectToDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    dbConnected: isConnected
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Food Surplus API is running!',
    dbConnected: isConnected
  });
});

// No need for app.listen() in a serverless environment
// The PORT constant is also not needed

module.exports = app;