import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    platform: {
      type: String,
      enum: ['youtube', 'tiktok', 'instagram', 'other'],
      default: 'other',
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    metadata: {
      videoId: String,
      channelTitle: String,
      publishedAt: Date,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster querying
videoSchema.index({ user: 1 });
videoSchema.index({ user: 1, platform: 1 });
videoSchema.index({ user: 1, tags: 1 });
videoSchema.index({ title: 'text', description: 'text' });

// Get videos by platform for a specific user
videoSchema.statics.getVideosByPlatform = async function (userId, platform) {
  return this.find({ user: userId, platform });
};

// Get videos by tag for a specific user
videoSchema.statics.getVideosByTag = async function (userId, tag) {
  return this.find({ user: userId, tags: tag });
};

// Search videos by title or description for a specific user
videoSchema.statics.searchVideos = async function (userId, query) {
  return this.find(
    {
      user: userId,
      $text: { $search: query },
    },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// Add a tag to a video
videoSchema.methods.addTag = function (tag) {
  const tagLower = tag.trim().toLowerCase();
  if (!this.tags.includes(tagLower)) {
    this.tags.push(tagLower);
  }
  return this.save();
};

// Remove a tag from a video
videoSchema.methods.removeTag = function (tag) {
  const tagLower = tag.trim().toLowerCase();
  this.tags = this.tags.filter(t => t !== tagLower);
  return this.save();
};

// Check if video has a specific tag
videoSchema.methods.hasTag = function (tag) {
  const tagLower = tag.trim().toLowerCase();
  return this.tags.includes(tagLower);
};

// Format duration from seconds to HH:MM:SS
videoSchema.methods.formatDuration = function () {
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  
  const parts = [];
  if (hours > 0) parts.push(hours.toString().padStart(2, '0'));
  parts.push(minutes.toString().padStart(2, '0'));
  parts.push(seconds.toString().padStart(2, '0'));
  
  return parts.join(':');
};

const Video = mongoose.model('Video', videoSchema);

export default Video;
