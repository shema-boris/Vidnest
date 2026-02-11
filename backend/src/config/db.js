import mongoose from 'mongoose';

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
      }
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        const delay = Math.min(1000 * 2 ** i, 10000);
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        console.error('All MongoDB connection attempts failed. Server will start without DB.');
      }
    }
  }
};

export default connectDB;
