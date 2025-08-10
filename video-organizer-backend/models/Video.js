const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    platform: {
        type: String,
        required: [true, 'Platform is required'],
        enum: ['Instagram', 'TikTok', 'YouTube', 'Other'],
        default: 'Other'
    },
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required'],
        trim: true,
        match: [
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            'Please enter a valid URL'
        ]
    },
    title: {
        type: String,
        trim: true,
        maxLength: [200, 'Title cannot be more than 200 characters']
    },
    author: {
        type: String,
        trim: true,
        maxLength: [100, 'Author name cannot be more than 100 characters']
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    uploadDate: {
        type: Date
    },
    description: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    videoType: {
        type: String,
        enum: ['standard', 'short', 'other'],
        default: 'standard'
    },
    videoId: {
        type: String,
        trim: true,
        index: true
    },
    duration: {
        type: String, // ISO 8601 duration format (PT5M30S)
        trim: true
    },
    thumbnailUrl: {
        type: String,
        trim: true,
        match: [
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            'Please enter a valid URL'
        ]
    },
    privacyStatus: {
        type: String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    savedAt: {
        type: Date,
        default: Date.now
    },
    localFilePath: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create indexes for better query performance
videoSchema.index({ userId: 1, platform: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ category: 1 });
videoSchema.index({ videoId: 1 });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;