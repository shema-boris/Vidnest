const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const verifyToken = require('../middleware/verifyToken');

// Protect all routes
router.use(verifyToken);

// @desc    Create new video
// @route   POST /api/videos
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { category, ...videoData } = req.body;
        if (!category) {
            return res.status(400).json({ success: false, error: 'Category is required' });
        }
        const video = new Video({
            ...videoData,
            category, // expects ObjectId
            userId: req.user._id
        });
        
        const savedVideo = await video.save();
        res.status(201).json({
            success: true,
            data: savedVideo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get all videos for logged-in user with filters
// @route   GET /api/videos
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { platform, category, tags, search } = req.query;
        
        // Base query with user filter
        const query = { userId: req.user._id };

        // Add platform filter
        if (platform) {
            query.platform = platform;
        }

        // Add category filter
        if (category) {
            query.category = category; // expects ObjectId string
        }

        // Add tags filter (handle both comma-separated string and array)
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            query.tags = { $in: tagArray };
        }

        // Add search functionality across title and tags
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with sorting
        const videos = await Video.find(query)
            .populate('category')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: videos.length,
            data: videos,
            filters: {
                platform: platform || 'all',
                category: category || 'all',
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                search: search || ''
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get specific video
// @route   GET /api/videos/:id
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        
        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        // Check video ownership
        if (video.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this video'
            });
        }

        res.json({
            success: true,
            data: video
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        // Check video ownership
        if (video.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this video'
            });
        }

        // Prevent updating userId
        delete req.body.userId;

        video = await Video.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: video
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                error: 'Video not found'
            });
        }

        // Check video ownership
        if (video.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this video'
            });
        }

        await video.deleteOne();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get top 10 most used tags for logged-in user
// @route   GET /api/videos/tags/top
// @access  Private
router.get('/tags/top', async (req, res) => {
    try {
        const topTags = await Video.aggregate([
            // Match videos belonging to the logged-in user
            { $match: { userId: req.user._id } },
            
            // Unwind the tags array to create a document for each tag
            { $unwind: '$tags' },
            
            // Group by tag and count occurrences
            { 
                $group: { 
                    _id: '$tags',
                    count: { $sum: 1 },
                    // Collect some video examples for each tag
                    videos: { 
                        $push: { 
                            videoId: '$_id',
                            title: '$title',
                            platform: '$platform'
                        }
                    }
                }
            },
            
            // Sort by count in descending order
            { $sort: { count: -1 } },
            
            // Limit to top 10
            { $limit: 10 },
            
            // Format the output
            {
                $project: {
                    _id: 0,
                    tag: '$_id',
                    count: 1,
                    // Only include first 3 video examples
                    recentVideos: { $slice: ['$videos', 3] }
                }
            }
        ]);

        res.json({
            success: true,
            count: topTags.length,
            data: topTags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Import video from URL
// @desc    Import video from URL
// @route   POST /api/videos/import
// @access  Private
router.post('/import', async (req, res) => {
    try {
        const videoImportController = require('../controllers/videoImportController');
        await videoImportController.importVideo(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to process video import'
        });
    }
});

module.exports = router;
