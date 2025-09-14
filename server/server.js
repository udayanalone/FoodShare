const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const path = require('path');
const morgan = require('morgan');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'https://foodshare-udayanalone.vercel.app',
    'https://food-share-vert.vercel.app',
    'https://foodshare-udayanalone.vercel.app',
    'https://food-share-vert.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);

// Request logging
app.use(morgan('dev'));

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Food Surplus API is running!', version: '1.0.0' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'production' ? null : err.message });
});

// MongoDB connection
connectDB();

// Simple status endpoint
app.get('/status', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;