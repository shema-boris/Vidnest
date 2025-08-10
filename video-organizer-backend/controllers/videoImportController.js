const Video = require('../models/Video');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const { TikTokDownloader } = require('../utils/platforms/tiktokDownloader');
const { InstagramDownloader } = require('../utils/platforms/instagramDownloader');
const { YouTubeDownloader } = require('../utils/platforms/youtubeDownloader');

// Platform downloader instances
const PLATFORMS = {
    TikTok: TikTokDownloader,
    Instagram: InstagramDownloader,
    YouTube: YouTubeDownloader
};

// Helper function to get platform downloader
const getPlatformDownloader = (platform) => {
    if (!PLATFORMS[platform]) {
        throw new Error(`Unsupported platform: ${platform}`);
    }
    return PLATFORMS[platform];
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
        const userId = req.user.id; // Get user ID from JWT

        // Validate required fields
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'Video URL is required'
            });
        }

        if (!category) {
            return res.status(400).json({
                success: false,
                error: 'Category is required'
            });
        }

        // Get platform from URL
        const platform = getPlatformFromUrl(url);
        const downloader = getPlatformDownloader(platform);

        // Validate URL for specific platform
        if (!downloader.isValidUrl(url)) {
            return res.status(400).json({
                success: false,
                error: downloader.getErrorMessage('INVALID_URL')
            });
        }

        // Create temporary directory for downloads
        const tempDir = path.join(__dirname, '../temp');
        await fs.mkdir(tempDir, { recursive: true });

        // Download video using platform-specific downloader
        const downloadResult = await downloader.downloadVideo(url, tempDir);

        // Create video document
        const videoData = {
            userId,
            platform,
            videoUrl: url,
            title: title || downloadResult.metadata.title,
            description: description || downloadResult.metadata.description,
            category,
            localFilePath: downloadResult.path,
            ...downloadResult.metadata // Include all other metadata
        };

        // Save video to database
        const video = new Video(videoData);
        await video.save();

        // Clean up temporary files after successful save
        await fs.unlink(downloadResult.path);

        return res.status(201).json({
            success: true,
            data: {
                id: video._id,
                title: video.title,
                platform: video.platform,
                savedAt: video.savedAt,
                metadata: {
                    author: video.author,
                    views: video.views,
                    likes: video.likes,
                    dislikes: video.dislikes,
                    comments: video.comments,
                    uploadDate: video.uploadDate,
                    duration: video.duration,
                    thumbnailUrl: video.thumbnailUrl
                }
            }
        });

    } catch (error) {
        console.error('Error importing video:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    importVideo
};
