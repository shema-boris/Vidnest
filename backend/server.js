import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import previewRoutes from './routes/previewRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'; // <-- import category routes

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
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, mobile apps, curl
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://vidnest.vercel.app',
      'https://vidnest.onrender.com'
    ];
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^https:\/\/vidnest-[a-z0-9]+-vidnest\.vercel\.app$/.test(origin)) return callback(null, true);
    return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// -------------------- Middleware --------------------
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// -------------------- Routes --------------------
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/preview', previewRoutes);
app.use('/api/categories', categoryRoutes); // <-- mount categories correctly

// -------------------- Error Handling --------------------
app.use(notFound);
app.use(errorHandler);

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
