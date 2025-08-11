const Video = require('../models/Video');
const Progress = require('../middleware/progressTracking');
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
const importVideo = async (data, res) => {
    try {
        // If data is a request object, extract the data
        const { req } = data || {};
        const { url, title, description, category, userId } = req ? {
            url: req.body.url,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            userId: req.user.id
        } : {
            url: data.url,
            title: data.title,
            description: data.description,
            category: data.category,
            userId: data.userId
        };

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

        // Create progress tracker
        const progress = new Progress({
            userId,
            videoId: null, // Will be set after video creation
            status: 'pending',
            message: 'Starting video import...'
        });
        await progress.save();

        // Create video record first
        const video = new Video({
            userId,
            platform: getPlatformFromUrl(url),
            videoUrl: url,
            title: title || '',
            description: description || '',
            category
        });
        await video.save();

        // Update progress with video ID
        await progress.updateProgress('in_progress', null, 'Downloading video...');
        progress.videoId = video._id;
        await progress.save();

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
        const downloadResult = await downloader.downloadVideo(url, tempDir, (progressPercent) => {
            progress.updateProgress('in_progress', progressPercent, 'Downloading...');
        });

        // Update video record with metadata
        await Video.findByIdAndUpdate(video._id, {
            title: downloadResult.metadata.title || title,
            description: downloadResult.metadata.description || description,
            author: downloadResult.metadata.author,
            views: downloadResult.metadata.views,
            likes: downloadResult.metadata.likes,
            comments: downloadResult.metadata.comments,
            uploadDate: downloadResult.metadata.uploadDate,
            duration: downloadResult.metadata.duration,
            thumbnailUrl: downloadResult.metadata.thumbnailUrl,
            localFilePath: downloadResult.path
        });

        // Update progress to completed
        await progress.updateProgress('completed', 100, 'Video imported successfully');

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
        // Update progress to failed
        await Progress.findByIdAndDelete(progress._id).catch(() => {});
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
