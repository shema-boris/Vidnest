import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import previewRoutes from './routes/previewRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import shareRoutes from './routes/shareRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// CORS setup
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
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

// Core middleware
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/preview', previewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/share', shareRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

export default app;


