const BasePlatform = require('./basePlatform');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Instagram URL patterns
const INSTAGRAM_URL_PATTERNS = [
    /^https?:\/\/(?:www\.)?instagram\.com\//,
    /^https?:\/\/instagram\.com\//
];

// Instagram video types
const VIDEO_TYPES = {
    POST: 'post',
    REEL: 'reel',
    STORY: 'story'
};

class InstagramDownloader extends BasePlatform {
    constructor() {
        super();
        this.name = 'Instagram';
        this.urlPatterns = INSTAGRAM_URL_PATTERNS;
        this.videoTypes = VIDEO_TYPES;
    }

    // Extract video ID from Instagram URL
    extractVideoId(url) {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            const segments = path.split('/');
            
            // Handle different URL patterns
            if (segments.includes('p')) {
                return segments[segments.indexOf('p') + 1];
            }
            if (segments.includes('reel')) {
                return segments[segments.indexOf('reel') + 1];
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // Get video type from URL
    getVideoType(url) {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        
        if (path.includes('/reel/')) return VIDEO_TYPES.REEL;
        if (path.includes('/stories/')) return VIDEO_TYPES.STORY;
        return VIDEO_TYPES.POST;
    }

    // Download Instagram video
    async downloadVideo(url, outputDir) {
        try {
            // Validate URL
            if (!this.isValidUrl(url)) {
                throw new Error('Invalid Instagram URL format');
            }

            // Get video ID and type
            const videoId = this.extractVideoId(url);
            const videoType = this.getVideoType(url);

            if (!videoId) {
                throw new Error('Could not extract video ID from URL');
            }

            // Fetch video page
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            });

            // Parse HTML
            const $ = cheerio.load(response.data);
            const scriptTags = $('script[type="application/ld+json"]');
            let videoData = null;

            // Try to find video data in script tags
            for (let i = 0; i < scriptTags.length; i++) {
                const script = $(scriptTags[i]).text();
                try {
                    const data = JSON.parse(script);
                    if (data['@type'] === 'VideoObject') {
                        videoData = data;
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }

            if (!videoData) {
                throw new Error('Could not find video data');
            }

            // Extract video URL
            const videoUrl = videoData.contentUrl;
            if (!videoUrl) {
                throw new Error('Could not find video URL');
            }

            // Download video
            const videoResponse = await axios.get(videoUrl, {
                responseType: 'arraybuffer'
            });

            // Generate unique filename
            const filename = `instagram_${videoId}.mp4`;
            const outputPath = path.join(outputDir, filename);

            // Save video
            await fs.writeFile(outputPath, videoResponse.data);

            // Extract metadata
            const metadata = {
                title: videoData.name || '',
                author: videoData.author?.name || '',
                views: videoData.interactionStatistic?.userInteractionCount || 0,
                uploadDate: videoData.datePublished,
                description: videoData.description || '',
                tags: videoData.keywords?.split(',') || [],
                videoType: videoType,
                videoId: videoId
            };

            return {
                path: outputPath,
                metadata
            };

        } catch (error) {
            console.error('Error downloading Instagram video:', error);
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
                batchDownload: false,
                playlistSupport: false,
                storySupport: true,
                reelSupport: true
            }
        };
    }

    // Get error message for Instagram-specific errors
    getErrorMessage(errorCode) {
        const baseMessages = super.getErrorMessage(errorCode);
        const instagramMessages = {
            'PRIVATE_ACCOUNT': 'Account is private',
            'STORY_EXPIRED': 'Story has expired',
            'REEL_NOT_FOUND': 'Reel not found'
        };
        return instagramMessages[errorCode] || baseMessages;
    }
}

module.exports = new InstagramDownloader();
