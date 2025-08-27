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
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    url: {
      type: String,
      required: [true, 'Please add a URL'],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, 'Please specify the platform'],
      enum: ['youtube', 'tiktok', 'instagram', 'other'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    categories: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    metadata: {
      // Platform-specific metadata
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
videoSchema.index({ user: 1, platform: 1 });
videoSchema.index({ categories: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ user: 1, url: 1 }, { unique: true }); // Add unique compound index

// Static method to get videos by platform
videoSchema.statics.getVideosByPlatform = async function (userId, platform) {
  return await this.find({ user: userId, platform });
};

// Static method to get videos by category
videoSchema.statics.getVideosByCategory = async function (userId, category) {
  return await this.find({ user: userId, categories: category.toLowerCase() });
};

// Static method to search videos
videoSchema.statics.searchVideos = async function (userId, query) {
  return await this.find({
    user: userId,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { categories: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } },
    ],
  });
};

const Video = mongoose.model('Video', videoSchema);

export default Video;
