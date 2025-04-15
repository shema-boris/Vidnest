require("dotenv").config();
const express = require('express');
const cors = require("cors");
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const videoRoutes = require('./routes/video');
const categoryRoutes = require('./routes/category');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/categories', categoryRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server Error'
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));