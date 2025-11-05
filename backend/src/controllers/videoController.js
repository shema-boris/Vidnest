import Video from '../models/Video.js';
import Category from '../models/Category.js';
import { validationResult } from 'express-validator';

// @desc    Get all videos for the authenticated user
// @route   GET /api/videos
// @access  Private
export const getVideos = async (req, res) => {
  try {
    if (!req.user){
      return res.status(401).json({message: 'Not authorized'});
    }
    const { query = '', tags = [], sort = '-createdAt', page = 1, limit = 12 } = req.query;
    
    // Build query object
    const queryObj = { user: req.user.id };
    
    // Add search query
    if (query) {
      queryObj.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }
    
    // Add tags filter
    if (tags && tags.length > 0) {
      queryObj.tags = { $all: Array.isArray(tags) ? tags : [tags] };
    }
    
    // Execute query
    const videos = await Video.find(queryObj)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
      .populate('category', 'name');
    
    // Get total count for pagination
    const total = await Video.countDocuments(queryObj);
    
    res.json({
      videos,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
    
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single video by ID
// @route   GET /api/videos/:id
// @access  Private
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, user: req.user.id })
      .populate('category', 'name');
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { title, url, thumbnail, duration, platform, tags = [], category } = req.body;
    
    // If category is provided, check if it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    // Create new video
    const video = new Video({
      user: req.user.id,
      title,
      url,
      thumbnail,
      duration,
      platform,
      tags,
      category: category || null
    });
    
    await video.save();
    await video.populate('category', 'name');
    
    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
  try {
    const { title, description, tags = [], category } = req.body;
    
    // If category is provided, check if it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    // Find video and verify ownership
    let video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    if (video.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update fields
    video.title = title || video.title;
    video.description = description || video.description;
    video.tags = tags;
    video.category = category || null;
    
    await video.save();
    await video.populate('category', 'name');
    
    res.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
  try {
    // Find video and verify ownership
    const video = await Video.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Delete the video
    await Video.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Video removed' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all unique tags from user's videos
// @route   GET /api/videos/tags
// @access  Private
export const getVideoTags = async (req, res) => {
  try {
    const tags = await Video.distinct('tags', { user: req.user.id });
    res.json(tags);
  } catch (error) {
    console.error('Error fetching video tags:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
