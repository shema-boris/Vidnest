import mongoose from 'mongoose'; 
import request from 'supertest';
import app from '../server.js';
import Video from '../models/Video.js';
import User from '../models/User.js';

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
  // Connect to a test database only if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI + '_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

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
  
  authToken = res.body.token;
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany({});
  await Video.deleteMany({});
  await mongoose.connection.close();
});

describe('Video API', () => {
  // Test creating a video
  describe('POST /api/videos', () => {
    it('should create a new video', async () => {
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
