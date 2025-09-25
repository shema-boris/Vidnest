import express from 'express';
import { check } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// Protected routes
router.post('/logout', protect, logout);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
