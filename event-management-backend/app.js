const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const path = require('path');

dotenv.config();  // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Serve static files (like images) from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', (req, res, next) => {
    req.io = req.app.get('socketio');  // Pass the io instance from server.js
    next();
}, eventRoutes);

// Handle 404 for any unknown routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Exporting app for serverless or other environments
module.exports = app;
