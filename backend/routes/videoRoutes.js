import express from 'express';
import { check, query } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByPlatform,
  getVideosByCategory,
  searchVideos,
  getPublicVideos,
  getPublicVideoById,
  getAllTags,
  incrementViews,
} from '../controllers/videoController.js';

const router = express.Router();

// --- Public Routes ---

// @route   GET /api/videos/public
// @desc    Get all public videos
// @access  Public
router.get('/public', getPublicVideos);

// @route   GET /api/videos/tags
// @desc    Get all unique tags from public videos
// @access  Public
router.get('/tags', getAllTags);

// @route   GET /api/videos/public/:id
// @desc    Get a single public video by ID
// @access  Public
router.get('/public/:id', [check('id', 'Invalid video ID').isMongoId()], getPublicVideoById);

// @route   POST /api/videos/:id/views
// @desc    Increment video views
// @access  Public
router.post('/:id/views', [check('id', 'Invalid video ID').isMongoId()], incrementViews);


// --- Private Routes (Require Authentication) ---

// @route   GET /api/videos
// @desc    Get all videos for the authenticated user
// @access  Private
router.get('/', protect, getVideos);

// @route   POST /api/videos
// @desc    Create a video
// @access  Private
router.post(
  '/',
  protect,
  [
    check('url', 'URL is required').isURL(),
    check('title', 'Title is required').notEmpty(),
    check('platform', 'Platform is required').isIn(['youtube', 'tiktok', 'instagram', 'other']),
    check('categories', 'Categories must be an array').optional().isArray(),
    check('tags', 'Tags must be an array').optional().isArray(),
  ],
  createVideo
);

// @route   GET /api/videos/:id
// @desc    Get a video by ID for the authenticated user
// @access  Private
router.get(
  '/:id',
  protect,
  [
    check('id', 'Invalid video ID').isMongoId(),
  ],
  getVideoById
);

// @route   PUT /api/videos/:id
// @desc    Update a video
// @access  Private
router.put(
  '/:id',
  protect,
  [
    check('id', 'Invalid video ID').isMongoId(),
    check('title', 'Title cannot be empty').optional().notEmpty(),
    check('platform', 'Invalid platform').optional().isIn(['youtube', 'tiktok', 'instagram', 'other']),
    check('categories', 'Categories must be an array').optional().isArray(),
    check('tags', 'Tags must be an array').optional().isArray(),
    check('isPublic', 'isPublic must be a boolean').optional().isBoolean(),
  ],
  updateVideo
);

// @route   DELETE /api/videos/:id
// @desc    Delete a video
// @access  Private
router.delete(
  '/:id',
  protect,
  [
    check('id', 'Invalid video ID').isMongoId(),
  ],
  deleteVideo
);


// The following routes are also protected and might be used for user-specific filtering.
// If they should be public, they need to be moved above and adapted.

// @route   GET /api/videos/search
// @desc    Search videos for the authenticated user
// @access  Private
router.get(
  '/search',
  protect,
  [
    query('q', 'Search query is required').notEmpty(),
  ],
  searchVideos
);

// @route   GET /api/videos/platform/:platform
// @desc    Get videos by platform for the authenticated user
// @access  Private
router.get(
  '/platform/:platform',
  protect,
  [
    check('platform', 'Platform is required').isIn(['youtube', 'tiktok', 'instagram', 'other']),
  ],
  getVideosByPlatform
);

// @route   GET /api/videos/category/:category
// @desc    Get videos by category for the authenticated user
// @access  Private
router.get(
  '/category/:category',
  protect,
  [
    check('category', 'Category is required').notEmpty(),
  ],
  getVideosByCategory
);

export default router;
