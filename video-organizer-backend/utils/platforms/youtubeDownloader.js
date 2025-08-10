const BasePlatform = require('./basePlatform');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { extractVideoId, isValidUrl, getVideoType } = require('./youtubeUtils');
const youtubeApiClient = require('../../utils/youtubeApiClient');
const ytdl = require('ytdl-core');

// YouTube video types
const VIDEO_TYPES = {
    STANDARD: 'standard',
    SHORT: 'short'
};

class YouTubeDownloader extends BasePlatform {
    constructor() {
        super();
        this.name = 'YouTube';
        this.videoTypes = VIDEO_TYPES;
    }

    // Validate YouTube URL
    isValidUrl(url) {
        return isValidUrl(url);
    }

    // Extract video ID from URL
    extractVideoId(url) {
        return extractVideoId(url);
    }

    // Get video type from URL
    getVideoType(url) {
        return getVideoType(url);
    }

    // Download YouTube video
    async downloadVideo(url, outputDir) {
        try {
            // Validate URL
            if (!this.isValidUrl(url)) {
                throw new Error('Invalid YouTube URL format');
            }

            // Get video ID and type
            const videoId = this.extractVideoId(url);
            const videoType = this.getVideoType(url);

            if (!videoId) {
                throw new Error('Could not extract video ID from URL');
            }

            // Check if video is accessible
            const isAccessible = await youtubeApiClient.isVideoAccessible(videoId);
            if (!isAccessible) {
                throw new Error('Video is not accessible');
            }

            // Get video information using YouTube Data API
            const videoInfo = await youtubeApiClient.getVideoDetails(videoId);

            if (!videoInfo) {
                throw new Error('Could not get video information');
            }

            // Download video using ytdl-core
            const filename = `youtube_${videoId}.mp4`;
            const outputPath = path.join(outputDir, filename);

            // Get video info for download options
            const ytdlInfo = await ytdl.getInfo(url);
            
            // Choose best quality format
            const format = ytdl.chooseFormat(ytdlInfo.formats, {
                quality: 'highestvideo',
                filter: 'videoandaudio'
            });

            // Create write stream
            const writeStream = fs.createWriteStream(outputPath);
            
            // Download video
            const videoStream = ytdl(url, { quality: format.itag });
            
            // Handle errors
            videoStream.on('error', (error) => {
                throw error;
            });

            // Handle progress
            videoStream.on('progress', (chunkLength, downloaded, total) => {
                console.log(`Downloading YouTube video: ${Math.round((downloaded / total) * 100)}%`);
            });

            // Handle completion
            return new Promise((resolve, reject) => {
                videoStream.pipe(writeStream);
                
                writeStream.on('finish', () => {
                    resolve({
                        path: outputPath,
                        metadata: {
                            title: videoInfo.title,
                            author: videoInfo.channelTitle,
                            views: videoInfo.viewCount,
                            likes: videoInfo.likeCount,
                            dislikes: videoInfo.dislikeCount,
                            comments: videoInfo.commentCount,
                            uploadDate: videoInfo.publishedAt,
                            description: videoInfo.description,
                            tags: videoInfo.tags,
                            videoType: videoType,
                            videoId: videoId,
                            duration: videoInfo.duration,
                            thumbnailUrl: videoInfo.thumbnail.url,
                            privacyStatus: videoInfo.privacyStatus
                        }
                    });
                });

                writeStream.on('error', reject);
            });

        } catch (error) {
            console.error('Error downloading YouTube video:', error);
            throw error;
        }
    }

    // Get platform metadata
    getPlatformMetadata() {
        return {
            name: this.name,
            supportedFeatures: {
                videoDownload: true,
                metadataExtraction: true,
                batchDownload: true,
                playlistSupport: true,
                shortsSupport: true
            }
        };
    }

    // Get error message for YouTube-specific errors
    getErrorMessage(errorCode) {
        const baseMessages = super.getErrorMessage(errorCode);
        const youtubeMessages = {
            'VIDEO_PRIVATE': 'Video is private',
            'VIDEO_DELETED': 'Video has been deleted',
            'PLAYLIST_PRIVATE': 'Playlist is private',
            'API_QUOTA_EXCEEDED': 'YouTube API quota exceeded',
            'VIDEO_NOT_FOUND': 'Video not found',
            'DOWNLOAD_FAILED': 'Failed to download video',
            'INVALID_FORMAT': 'Invalid video format'
        };
        return youtubeMessages[errorCode] || baseMessages;
    }
}

module.exports = new YouTubeDownloader();
