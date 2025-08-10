const URL = require('url').URL;

// YouTube URL patterns
const YOUTUBE_URL_PATTERNS = {
    // Standard YouTube URLs
    STANDARD: /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/,
    // YouTube short URLs
    SHORT: /^https?:\/\/youtu\.be\/([\w-]+)/,
    // YouTube playlist URLs
    PLAYLIST: /^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=([\w-]+)/
};

// Extract video ID from YouTube URL
const extractVideoId = (url) => {
    try {
        const urlObj = new URL(url);
        
        // Handle YouTube short URLs
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.substring(1);
        }

        // Handle standard YouTube URLs
        if (urlObj.hostname.includes('youtube.com')) {
            const searchParams = new URLSearchParams(urlObj.search);
            return searchParams.get('v');
        }

        return null;
    } catch (error) {
        return null;
    }
};

// Validate YouTube URL
const isValidUrl = (url) => {
    try {
        const urlObj = new URL(url);
        
        // Check if it's a YouTube domain
        if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
            return false;
        }

        // Check if it's a valid YouTube URL
        return YOUTUBE_URL_PATTERNS.STANDARD.test(url) || 
               YOUTUBE_URL_PATTERNS.SHORT.test(url);
    } catch (error) {
        return false;
    }
};

// Get video type from URL
const getVideoType = (url) => {
    try {
        const urlObj = new URL(url);
        
        if (urlObj.hostname === 'youtu.be') {
            return 'short';
        }

        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.pathname.includes('/shorts/')) {
                return 'short';
            }
            return 'standard';
        }

        return 'unknown';
    } catch (error) {
        return 'unknown';
    }
};

module.exports = {
    YOUTUBE_URL_PATTERNS,
    extractVideoId,
    isValidUrl,
    getVideoType
};
