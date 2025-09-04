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

// Static allowed origins (local dev + production)
const allowedOrigins = [
  'http://localhost:5173',       // Local Vite
  'http://localhost:5174',       // Another local dev port
  'http://localhost:3000',       // CRA or other local dev
  'https://vidnest.vercel.app'   // Production frontend
];

// Apply CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow if in static allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments dynamically
    if (/^https:\/\/vidnest-[a-z0-9]+-vidnest\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Otherwise block
    return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
  },
  credentials: true
}));

// -------------------- Middleware --------------------
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// -------------------- Routes --------------------
app.get('/', (req, res) => {
  res.send('API is running...');
});

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
