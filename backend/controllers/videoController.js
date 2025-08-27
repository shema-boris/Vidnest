import Video from '../models/Video.js';
import { extractVideoId } from '../utils/videoUtils.js';

// @desc    Get all videos
// @route   GET /api/videos
// @access  Private
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user._id });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Private
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
  try {
    const { url, title, description, platform, categories, tags, isPublic } = req.body;

    // Check if video with this URL already exists for the user
    const existingVideo = await Video.findOne({ 
      user: req.user._id, 
      url: url.trim() 
    });

    if (existingVideo) {
      return res.status(400).json({ 
        message: 'This video has already been added to your collection' 
      });
    }

    // Extract video ID if it's a known platform
    const videoId = extractVideoId(url, platform);
    
    const video = new Video({
      user: req.user._id,
      url: url.trim(),
      title: title?.trim() || 'Untitled Video',
      description: description?.trim() || '',
      platform: platform || 'other',
      categories: Array.isArray(categories) 
        ? categories.map(cat => cat.trim().toLowerCase()).filter(Boolean)
        : [],
      tags: Array.isArray(tags) 
        ? tags.map(tag => tag.trim().toLowerCase()).filter(Boolean)
        : [],
      isPublic: isPublic || false,
      metadata: {
        videoId,
      },
    });

    const createdVideo = await video.save();
    res.status(201).json(createdVideo);
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ 
        message: 'This video has already been added to your collection' 
      });
    }
    res.status(500).json({ 
      message: error.message || 'Error adding video. Please try again.' 
    });
  }
};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
  try {
    const { title, description, categories, tags, isPublic } = req.body;

    const video = await Video.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.title = title || video.title;
    video.description = description || video.description;
    
    if (categories) {
      video.categories = Array.isArray(categories)
        ? categories.map(cat => cat.trim().toLowerCase())
        : [];
    }
    
    if (tags) {
      video.tags = Array.isArray(tags)
        ? tags.map(tag => tag.trim().toLowerCase())
        : [];
    }
    
    if (typeof isPublic !== 'undefined') {
      video.isPublic = isPublic;
    }

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.remove();
    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get videos by platform
// @route   GET /api/videos/platform/:platform
// @access  Private
export const getVideosByPlatform = async (req, res) => {
  try {
    const videos = await Video.getVideosByPlatform(
      req.user._id,
      req.params.platform
    );
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get videos by category
// @route   GET /api/videos/category/:category
// @access  Private
export const getVideosByCategory = async (req, res) => {
  try {
    const videos = await Video.getVideosByCategory(
      req.user._id,
      req.params.category
    );
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search videos
// @route   GET /api/videos/search?q=:query
// @access  Private
export const searchVideos = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const videos = await Video.searchVideos(req.user._id, query);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all public videos
// @route   GET /api/videos/public
// @access  Public
export const getPublicVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublic: true }).populate('user', 'username');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single public video by ID
// @route   GET /api/videos/public/:id
// @access  Public
export const getPublicVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, isPublic: true }).populate('user', 'username');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique tags from public videos
// @route   GET /api/videos/tags
// @access  Public
export const getAllTags = async (req, res) => {
  try {
    const tags = await Video.distinct('tags', { isPublic: true });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment video views
// @route   POST /api/videos/:id/views
// @access  Public
export const incrementViews = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.views = (video.views || 0) + 1;
    await video.save();

    res.status(200).json({ message: 'View count updated', views: video.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
