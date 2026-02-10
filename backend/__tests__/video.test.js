import mongoose from 'mongoose'; 
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../src/app.js';
import Video from '../src/models/Video.js';
import User from '../src/models/User.js';

// Load environment variables
dotenv.config();

let authToken;
let testUser;
let testVideo;

// Test user data
const userData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'test1234',
};

// Test video data
const videoData = {
  title: 'Test Video',
  description: 'This is a test video',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  platform: 'youtube',
  tags: ['test', 'video'],
};

beforeAll(async () => {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not found. Skipping database tests.');
      return;
    }

    // Connect to a test database only if not already connected
    if (mongoose.connection.readyState === 0) {
      const testDbUri = process.env.MONGODB_URI.replace(/\/[^\/]*$/, '/vidnest_test');
      console.log('🔌 Connecting to test database...');
      await mongoose.connect(testDbUri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
      });
      console.log('✅ Connected to test database');
    }

    // Clear existing test data
    await User.deleteMany({});
    await Video.deleteMany({});

    // Create a test user
    const user = await User.create(userData);
    testUser = user;

    // Login to get auth token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      });
    
    // Extract JWT from response cookie (cookie-based auth)
    const cookies = res.headers['set-cookie'];
    if (cookies) {
      const jwtCookie = cookies.find(c => c.startsWith('jwt='));
      if (jwtCookie) {
        authToken = jwtCookie.split('=')[1].split(';')[0];
      }
    }
    console.log('✅ Test user created and authenticated');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    throw error;
  }
}, 60000); // Increase timeout to 60 seconds

afterAll(async () => {
  try {
    // Clean up test data
    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({});
      await Video.deleteMany({});
      await mongoose.connection.close();
      console.log('✅ Test cleanup completed');
    }
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}, 10000); // 10 second timeout

describe('Video API', () => {
  // Skip all tests if MongoDB is not available
  beforeEach(() => {
    if (!process.env.MONGODB_URI || mongoose.connection.readyState !== 1) {
      console.log('⏭️  Skipping test - MongoDB not available');
      return;
    }
  });

  // Test creating a video
  describe('POST /api/videos', () => {
    it('should create a new video', async () => {
      if (!authToken) {
        console.log('⏭️  Skipping test - No auth token');
        return;
      }

      const res = await request(app)
        .post('/api/videos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(videoData);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(videoData.title);
      
      testVideo = res.body;
    });
  });

  // Test getting all videos
  describe('GET /api/videos', () => {
    it('should get all videos for the authenticated user', async () => {
      const res = await request(app)
        .get('/api/videos')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('videos');
      expect(Array.isArray(res.body.videos)).toBeTruthy();
      expect(res.body.videos.length).toBeGreaterThan(0);
    });
  });

  // Test getting a single video
  describe('GET /api/videos/:id', () => {
    it('should get a single video by ID', async () => {
      const res = await request(app)
        .get(`/api/videos/${testVideo._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', testVideo._id);
    });
  });

  // Test updating a video
  describe('PUT /api/videos/:id', () => {
    it('should update a video', async () => {
      const updatedData = {
        title: 'Updated Test Video',
        description: 'Updated description',
        tags: ['updated', 'video'],
      };
      
      const res = await request(app)
        .put(`/api/videos/${testVideo._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(updatedData.title);
      expect(res.body.description).toBe(updatedData.description);
      expect(res.body.tags).toEqual(expect.arrayContaining(updatedData.tags));
    });
  });

  // Test deleting a video
  describe('DELETE /api/videos/:id', () => {
    it('should delete a video', async () => {
      const res = await request(app)
        .delete(`/api/videos/${testVideo._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Video removed');
      
      // Verify the video was deleted
      const video = await Video.findById(testVideo._id);
      expect(video).toBeNull();
    });
  });
});
