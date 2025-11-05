import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
