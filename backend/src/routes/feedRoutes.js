import express from 'express';
import { protect } from '../middleware/auth.js';
import { getLatestFeed } from '../controllers/feedController.js';

const router = express.Router();

// All feed routes require authentication
router.use(protect);

/**
 * @route   GET /api/feed/latest
 * @desc    Get latest videos feed grouped by category
 * @access  Private
 */
router.get('/latest', getLatestFeed);

export default router;
