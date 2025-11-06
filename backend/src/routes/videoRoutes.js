import express from 'express';
import { check } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoTags
} from '../controllers/videoController.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

// @route   GET /api/videos
// @desc    Get all videos for the authenticated user
// @access  Private
router.get('/', getVideos);

// @route   GET /api/videos/tags
// @desc    Get all unique tags from user's videos
// @access  Private
router.get('/tags', getVideoTags);

// @route   GET /api/videos/:id
// @desc    Get a single video by ID
// @access  Private
router.get('/:id', [check('id', 'Invalid video ID').isMongoId()], getVideoById);

// @route   POST /api/videos
// @desc    Create a new video with automatic metadata extraction
// @access  Private
router.post('/', [
  check('url', 'Valid URL is required').isURL(),
  // Title, description, tags, and category are now optional (extracted automatically)
  check('title').optional().trim(),
  check('description').optional().trim(),
  check('tags').optional().isArray(),
  check('category').optional().isMongoId(),
], createVideo);

// @route   PUT /api/videos/:id
// @desc    Update a video
// @access  Private
router.put('/:id', [
  check('id', 'Invalid video ID').isMongoId(),
], updateVideo);

// @route   DELETE /api/videos/:id
// @desc    Delete a video
// @access  Private
router.delete('/:id', [
  check('id', 'Invalid video ID').isMongoId(),
], deleteVideo);

export default router;
