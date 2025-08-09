const Video = require('../models/Video');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Helper function to validate URL
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

// Helper function to extract platform from URL
const getPlatformFromUrl = (url) => {
    const hostname = new URL(url).hostname;
    if (hostname.includes('tiktok')) return 'TikTok';
    if (hostname.includes('instagram')) return 'Instagram';
    if (hostname.includes('youtube')) return 'YouTube';
    return 'Other';
};

// Main import function
const importVideo = async (req, res) => {
    try {
        const { url, title, description, category } = req.body;

        // Validate required fields
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'Video URL is required'
            });
        }

        // Validate URL format
        if (!isValidUrl(url)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }

        // Extract platform from URL
        const platform = getPlatformFromUrl(url);

        // Create unique filename for video
        const videoFilename = `${uuidv4()}.mp4`;
        const uploadPath = path.join(__dirname, '../uploads/videos', videoFilename);

        // Download video (this is a placeholder - actual implementation will depend on platform)
        // For now, we'll just create a dummy video file
        await fs.writeFile(uploadPath, 'DUMMY VIDEO CONTENT');

        // Create video object
        const video = new Video({
            userId: req.user._id,
            platform,
            videoUrl: uploadPath,
            title: title || `Imported from ${platform}`,
            description: description || '',
            category: category || null,
            tags: [] // Tags can be added later
        });

        // Save video to database
        const savedVideo = await video.save();

        res.status(201).json({
            success: true,
            data: savedVideo
        });

    } catch (error) {
        console.error('Error importing video:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to import video. Please try again later.'
        });
    }
};

module.exports = {
    importVideo
};
