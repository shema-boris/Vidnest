import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Load environment variables FIRST
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Environment variables loaded successfully');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set!');
}

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',  // Local development
    'https://vidnest-esw2q4p00-vidnest.vercel.app',  //  Vercel domain
    'https://vidnest.vercel.app'  //  production domain (if different)
  ],
  credentials: true,
}));

app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
