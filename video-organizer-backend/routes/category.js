const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const verifyToken = require('../middleware/verifyToken');

// Create a new category
router.post('/api/categories', verifyToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    // Check for duplicate category name for this user
    const existing = await Category.findOne({ name, user: req.user.id });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    const category = new Category({
      name,
      description,
      user: req.user.id
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all categories for the logged-in user
router.get('/api/categories', verifyToken, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a category (name or description)
router.put('/api/categories/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id, user: req.user.id });
    if (!category) {
      return res.status(404).json({ error: 'Category not found or unauthorized' });
    }
    const { name, description } = req.body;
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a category (with video handling)
router.delete('/api/categories/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const mode = req.query.mode || 'nullify'; // 'delete' or 'nullify'
    const category = await Category.findOneAndDelete({ _id: id, user: req.user.id });
    if (!category) {
      return res.status(404).json({ error: 'Category not found or unauthorized' });
    }
    const Video = require('../models/Video');
    if (mode === 'delete') {
      // Delete all videos linked to this category
      await Video.deleteMany({ category: id });
    } else {
      // Set category field to null for all videos linked to this category
      await Video.updateMany({ category: id }, { $set: { category: null } });
    }
    res.json({ message: 'Category deleted successfully', mode });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
