import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.route('/')
  .get(getCategories)
  .post(protect, createCategory);

router.route('/:id')
  .delete(protect, deleteCategory);

export default router;
