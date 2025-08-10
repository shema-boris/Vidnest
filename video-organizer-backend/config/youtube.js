module.exports = {
    // YouTube Data API configuration
    API_KEY: process.env.YOUTUBE_API_KEY,
    BASE_URL: 'https://www.googleapis.com/youtube/v3',
    
    // API endpoints
    ENDPOINTS: {
        VIDEO_DETAILS: '/videos',
        CHANNEL_DETAILS: '/channels',
        SEARCH: '/search'
    },
    
    // API parameters
    PARAMS: {
        PART: {
            VIDEO: 'snippet,contentDetails,statistics,status',
            CHANNEL: 'snippet,statistics'
        },
        MAX_RESULTS: 50,
        ORDER: 'date',
        TYPE: 'video'
    },
    
    // Rate limiting
    RATE_LIMIT: {
        QUOTA: 10000, // Daily quota
        WINDOW: 24 * 60 * 60 * 1000, // 24 hours
        RESET_TIME: 0, // UTC time in milliseconds
        CURRENT_QUOTA: 10000
    },
    
    // Error codes
    ERROR_CODES: {
        QUOTA_EXCEEDED: 'quotaExceeded',
        NOT_FOUND: 'notFound',
        PRIVATE_VIDEO: 'privateVideo',
        DELETED_VIDEO: 'deletedVideo'
    }
};
