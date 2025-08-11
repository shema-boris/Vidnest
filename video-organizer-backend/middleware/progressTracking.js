const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'failed'],
        default: 'pending'
    },
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

progressSchema.methods.updateProgress = async function(status, progress = null, message = null) {
    this.status = status;
    if (progress !== null) this.progress = progress;
    if (message) this.message = message;
    this.updatedAt = new Date();
    await this.save();
};

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
