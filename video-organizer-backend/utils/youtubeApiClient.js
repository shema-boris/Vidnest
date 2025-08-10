const axios = require('axios');
const config = require('../config/youtube');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Create rate limiter
const rateLimiter = new RateLimiterMemory({
    points: config.RATE_LIMIT.QUOTA,
    duration: config.RATE_LIMIT.WINDOW / 1000, // Convert to seconds
    blockDuration: 3600 // Block for 1 hour if rate limited
});

class YouTubeApiClient {
    constructor() {
        this.apiKey = config.API_KEY;
        this.baseUrl = config.BASE_URL;
        this.rateLimiter = rateLimiter;
    }

    // Make API request with rate limiting
    async request(endpoint, params = {}) {
        try {
            // Check rate limit
            await this.rateLimiter.consume('youtube-api');

            // Add required parameters
            params.key = this.apiKey;
            
            // Make API call
            const response = await axios.get(`${this.baseUrl}${endpoint}`, {
                params
            });

            return response.data;
        } catch (error) {
            // Handle rate limit errors
            if (error.response?.status === 403 && 
                error.response?.data?.error?.errors?.[0]?.reason === 'quotaExceeded') {
                throw new Error('YouTube API quota exceeded');
            }
            
            // Handle other errors
            throw error;
        }
    }

    // Get video details
    async getVideoDetails(videoId) {
        try {
            const params = {
                part: config.PARAMS.PART.VIDEO,
                id: videoId
            };

            const response = await this.request(config.ENDPOINTS.VIDEO_DETAILS, params);
            
            if (!response.items || response.items.length === 0) {
                throw new Error('Video not found');
            }

            const video = response.items[0];
            
            return {
                title: video.snippet.title,
                channelTitle: video.snippet.channelTitle,
                channelId: video.snippet.channelId,
                viewCount: video.statistics.viewCount,
                likeCount: video.statistics.likeCount,
                dislikeCount: video.statistics.dislikeCount,
                commentCount: video.statistics.commentCount,
                publishedAt: video.snippet.publishedAt,
                description: video.snippet.description,
                tags: video.snippet.tags || [],
                duration: video.contentDetails.duration,
                thumbnail: video.snippet.thumbnails.high,
                privacyStatus: video.status.privacyStatus
            };
        } catch (error) {
            console.error('Error getting video details:', error);
            throw error;
        }
    }

    // Get channel details
    async getChannelDetails(channelId) {
        try {
            const params = {
                part: config.PARAMS.PART.CHANNEL,
                id: channelId
            };

            const response = await this.request(config.ENDPOINTS.CHANNEL_DETAILS, params);
            
            if (!response.items || response.items.length === 0) {
                throw new Error('Channel not found');
            }

            const channel = response.items[0];
            
            return {
                title: channel.snippet.title,
                description: channel.snippet.description,
                viewCount: channel.statistics.viewCount,
                subscriberCount: channel.statistics.subscriberCount,
                videoCount: channel.statistics.videoCount,
                thumbnails: channel.snippet.thumbnails
            };
        } catch (error) {
            console.error('Error getting channel details:', error);
            throw error;
        }
    }

    // Search for videos
    async searchVideos(query, options = {}) {
        try {
            const params = {
                part: config.PARAMS.PART.VIDEO,
                q: query,
                type: config.PARAMS.TYPE,
                maxResults: options.maxResults || config.PARAMS.MAX_RESULTS,
                order: options.order || config.PARAMS.ORDER
            };

            const response = await this.request(config.ENDPOINTS.SEARCH, params);
            
            return response.items.map(item => ({
                videoId: item.id.videoId,
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                publishedAt: item.snippet.publishedAt,
                thumbnails: item.snippet.thumbnails
            }));
        } catch (error) {
            console.error('Error searching videos:', error);
            throw error;
        }
    }

    // Check if video is accessible
    async isVideoAccessible(videoId) {
        try {
            const params = {
                part: 'status',
                id: videoId
            };

            const response = await this.request(config.ENDPOINTS.VIDEO_DETAILS, params);
            
            if (!response.items || response.items.length === 0) {
                return false;
            }

            const video = response.items[0];
            return video.status.privacyStatus === 'public';
        } catch (error) {
            console.error('Error checking video accessibility:', error);
            throw error;
        }
    }
}

module.exports = new YouTubeApiClient();
