import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * @route   GET /api/preview
 * @desc    Get link preview metadata
 * @access  Public
 * @param   {string} url - The URL to get metadata for
 */
router.get('/', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Call Microlink API
    const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
    const response = await axios.get(microlinkUrl);

    // Extract and format the data we need
    const { data } = response;
    const previewData = {
      title: data.data.title || '',
      description: data.data.description || '',
      image: data.data.image?.url || '',
      url: data.data.url || url,
      siteName: data.data.publisher || new URL(url).hostname.replace('www.', ''),
      favicon: data.data.logo?.url || `https://www.google.com/s2/favicons?domain=${url}`,
    };

    res.json(previewData);
  } catch (error) {
    console.error('Link preview error:', error);
    
    // Try to provide a basic fallback if the API call fails
    if (error.response) {
      return res.status(error.response.status).json({
        message: 'Failed to fetch link preview',
        error: error.response.data
      });
    }
    
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
