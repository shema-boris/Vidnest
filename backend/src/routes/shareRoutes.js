import express from 'express';
import { protect } from '../middleware/auth.js';
import { extractVideoMetadata } from '../services/videoImportService.js';

const router = express.Router();

// @desc    Handle shared video content from mobile
// @route   POST /api/share/process
// @access  Private
router.post('/process', protect, async (req, res) => {
  try {
    const { url, title, text } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }

    // Extract metadata from the shared URL
    const metadata = await extractVideoMetadata(url);
    
    // Return processed data for frontend
    res.json({
      success: true,
      data: {
        url,
        title: metadata.title || title || 'Untitled Video',
        description: metadata.description || text || '',
        thumbnail: metadata.thumbnail || '',
        platform: metadata.platform || 'other',
        author: metadata.author || '',
        publishedAt: metadata.publishedAt || new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing shared content:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process shared content',
      error: error.message 
    });
  }
});

// @desc    Get metadata for a URL (for preview)
// @route   GET /api/share/metadata
// @access  Private
router.get('/metadata', protect, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL parameter is required' 
      });
    }

    const metadata = await extractVideoMetadata(url);
    
    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error extracting metadata:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to extract metadata',
      error: error.message 
    });
  }
});

export default router;
