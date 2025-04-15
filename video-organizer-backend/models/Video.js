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
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create indexes for better query performance
videoSchema.index({ userId: 1, platform: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ category: 1 });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;