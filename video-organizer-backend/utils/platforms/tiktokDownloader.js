const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// TikTok video URL patterns
const TIKTOK_URL_PATTERNS = [
    /^https?:\/\/(?:vm|vt|www)\.tiktok\.com\//,
    /^https?:\/\/tiktok\.com\//
];

// Validate TikTok URL
const isValidTiktokUrl = (url) => {
    return TIKTOK_URL_PATTERNS.some(pattern => pattern.test(url));
};

// Extract video ID from TikTok URL
const extractVideoId = (url) => {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const segments = path.split('/');
        
        // Try different patterns
        if (segments.includes('video')) {
            return segments[segments.indexOf('video') + 1];
        }
        if (segments.includes('t/')) {
            return segments[segments.indexOf('t/') + 1];
        }
        return null;
    } catch (error) {
        return null;
    }
};

// Download TikTok video
const downloadTiktokVideo = async (url, outputDir) => {
    try {
        // Validate URL
        if (!isValidTiktokUrl(url)) {
            throw new Error('Invalid TikTok URL format');
        }

        // Get video ID
        const videoId = extractVideoId(url);
        if (!videoId) {
            throw new Error('Could not extract video ID from URL');
        }

        // Fetch video page
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Parse HTML
        const $ = cheerio.load(response.data);
        const videoUrl = $('video').attr('src');

        if (!videoUrl) {
            throw new Error('Could not find video source URL');
        }

        // Download video
        const videoResponse = await axios.get(videoUrl, {
            responseType: 'arraybuffer'
        });

        // Generate unique filename
        const filename = `tiktok_${videoId}.mp4`;
        const outputPath = path.join(outputDir, filename);

        // Save video
        await fs.writeFile(outputPath, videoResponse.data);

        // Extract metadata
        const title = $('h1').first().text().trim();
        const author = $('.user-info h3').text().trim();
        const views = $('.video-info .icon-play').next().text().trim();

        return {
            path: outputPath,
            metadata: {
                title,
                author,
                views,
                platform: 'TikTok',
                videoId
            }
        };

    } catch (error) {
        console.error('Error downloading TikTok video:', error);
        throw error;
    }
};

module.exports = {
    downloadTiktokVideo,
    isValidTiktokUrl,
    extractVideoId
};
