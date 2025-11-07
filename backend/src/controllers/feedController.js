import Video from '../models/Video.js';
import Category from '../models/Category.js';

/**
 * @desc    Get latest videos feed grouped by category
 * @route   GET /api/feed/latest
 * @access  Private
 */
export const getLatestFeed = async (req, res) => {
  try {
    // Fetch all videos for the authenticated user, sorted by most recent
    const videos = await Video.find({ user: req.user.id })
      .populate('category', 'name')
      .select('title thumbnail url createdAt platform tags duration')
      .sort({ createdAt: -1 })
      .lean();

    // Group videos by category
    const groupedFeed = {};

    for (const video of videos) {
      const categoryName = video.category?.name || 'Uncategorized';
      
      if (!groupedFeed[categoryName]) {
        groupedFeed[categoryName] = [];
      }

      // Add video to category group with formatted data
      groupedFeed[categoryName].push({
        _id: video._id,
        title: video.title,
        thumbnail: video.thumbnail,
        url: video.url,
        createdAt: video.createdAt,
        platform: video.platform,
        tags: video.tags,
        duration: video.duration
      });
    }

    // Return grouped feed
    res.json(groupedFeed);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ 
      message: 'Error fetching feed', 
      error: error.message 
    });
  }
};
