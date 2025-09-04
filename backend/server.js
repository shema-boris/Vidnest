import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Environment variables loaded successfully');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set!');
}

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// -------------------- CORS Setup --------------------
// Whitelist of allowed frontend origins
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',

  // Vercel preview deployments (add any new preview URLs if needed)
  'https://vidnest-esw2q4p00-vidnest.vercel.app',
  'https://vidnest-git-master-vidnest.vercel.app',
  'https://vidnest-qf09pxkv3-vidnest.vercel.app',

  // Production domain
  'https://vidnest.vercel.app'
];

// Apply CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (e.g., Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true // Allow cookies/auth headers
}));

// Parse JSON bodies
app.use(express.json());

// -------------------- Logging --------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// -------------------- Routes --------------------
// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// -------------------- Error Handling --------------------
app.use(notFound);
app.use(errorHandler);

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
