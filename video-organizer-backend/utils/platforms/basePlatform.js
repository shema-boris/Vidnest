class BasePlatform {
    constructor() {
        this.name = 'BasePlatform';
        this.urlPatterns = [];
    }

    // Validate if URL belongs to this platform
    isValidUrl(url) {
        return this.urlPatterns.some(pattern => pattern.test(url));
    }

    // Extract video ID from URL
    extractVideoId(url) {
        throw new Error('Must be implemented by subclass');
    }

    // Download video and extract metadata
    async downloadVideo(url, outputDir) {
        throw new Error('Must be implemented by subclass');
    }

    // Get platform-specific metadata
    getPlatformMetadata() {
        return {
            name: this.name,
            supportedFeatures: {
                videoDownload: true,
                metadataExtraction: true,
                batchDownload: false,
                playlistSupport: false
            }
        };
    }

    // Get error message for platform-specific errors
    getErrorMessage(errorCode) {
        const messages = {
            'INVALID_URL': 'Invalid URL format for this platform',
            'PRIVATE_CONTENT': 'Content is private or deleted',
            'RATE_LIMITED': 'Rate limit exceeded',
            'AUTH_REQUIRED': 'Authentication required',
            'NOT_FOUND': 'Content not found'
        };
        return messages[errorCode] || 'Unknown error';
    }
}

module.exports = BasePlatform;
