import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

// Public routes (no authentication required)
router.route('/')
  .get(getCategories)
  .post(createCategory);

router.route('/:id')
  .delete(deleteCategory);

export default router;
