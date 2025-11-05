/**
 * VIDEO IMPORT SERVICE - USAGE EXAMPLES
 * 
 * This file demonstrates how to use the video metadata extraction service
 * across different parts of your application.
 */

import { 
  extractVideoMetadata, 
  detectPlatform, 
  extractVideoId,
  suggestCategory,
  suggestTags
} from './videoImportService.js';

// ========================================
// EXAMPLE 1: Extract Complete Metadata
// ========================================
async function exampleCompleteExtraction() {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  
  try {
    const metadata = await extractVideoMetadata(url);
    
    console.log('Complete Metadata:', metadata);
    /*
    Output structure:
    {
      title: "Rick Astley - Never Gonna Give You Up",
      description: "Official music video...",
      thumbnail: "https://img.youtube.com/...",
      platform: "youtube",
      author: "Rick Astley",
      duration: 213,
      publishedAt: "2009-10-25T...",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoId: "dQw4w9WgXcQ",
      suggestedCategory: "Music",
      suggestedTags: ["youtube", "music", "entertainment"]
    }
    */
  } catch (error) {
    console.error('Error:', error);
    // Note: extractVideoMetadata never throws, always returns valid object
  }
}

// ========================================
// EXAMPLE 2: Use in ShareTarget (PWA)
// ========================================
async function shareTargetExample(sharedUrl) {
  // When user shares from mobile app to your PWA
  const metadata = await extractVideoMetadata(sharedUrl);
  
  // Pre-fill form with extracted data
  const formData = {
    title: metadata.title,
    description: metadata.description,
    url: metadata.url,
    thumbnail: metadata.thumbnail,
    platform: metadata.platform,
    tags: metadata.suggestedTags, // Use suggested tags
    category: metadata.suggestedCategory // Use suggested category
  };
  
  return formData;
}

// ========================================
// EXAMPLE 3: Use in Bookmarklet
// ========================================
async function bookmarkletExample() {
  // Get current page URL from browser
  const currentUrl = window.location.href;
  
  // Extract metadata
  const metadata = await extractVideoMetadata(currentUrl);
  
  // Open your app with pre-filled data
  const appUrl = `https://vidnest.com/videos/add?` + 
    `url=${encodeURIComponent(metadata.url)}&` +
    `title=${encodeURIComponent(metadata.title)}&` +
    `thumbnail=${encodeURIComponent(metadata.thumbnail)}&` +
    `platform=${metadata.platform}&` +
    `tags=${encodeURIComponent(metadata.suggestedTags.join(','))}`;
  
  window.open(appUrl, '_blank');
}

// ========================================
// EXAMPLE 4: Use in Add Video Controller
// ========================================
async function videoControllerExample(req, res) {
  const { url } = req.body;
  
  // Extract metadata when user provides URL
  const metadata = await extractVideoMetadata(url);
  
  // Create video with extracted data
  const video = {
    user: req.user.id,
    title: metadata.title,
    description: metadata.description,
    url: metadata.url,
    thumbnail: metadata.thumbnail,
    platform: metadata.platform,
    duration: metadata.duration,
    tags: metadata.suggestedTags,
    // Let user override suggested category or use it as default
    category: req.body.category || metadata.suggestedCategory
  };
  
  // Save to database...
  return video;
}

// ========================================
// EXAMPLE 5: Platform Detection Only
// ========================================
function platformDetectionExample() {
  const urls = [
    'https://www.youtube.com/watch?v=123',
    'https://www.tiktok.com/@user/video/123',
    'https://www.instagram.com/p/ABC123/',
    'https://vimeo.com/123456789'
  ];
  
  urls.forEach(url => {
    const platform = detectPlatform(url);
    console.log(`${url} -> Platform: ${platform}`);
  });
}

// ========================================
// EXAMPLE 6: Extract Video ID Only
// ========================================
function videoIdExample() {
  const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const platform = detectPlatform(youtubeUrl);
  const videoId = extractVideoId(youtubeUrl, platform);
  
  console.log(`Video ID: ${videoId}`); // Output: dQw4w9WgXcQ
}

// ========================================
// EXAMPLE 7: Manual Suggestions
// ========================================
function manualSuggestionsExample() {
  const metadata = {
    title: 'How to Build a React App - Complete Tutorial',
    description: 'Learn React from scratch with this comprehensive guide',
    platform: 'youtube',
    author: 'Code Academy'
  };
  
  const category = suggestCategory(metadata);
  const tags = suggestTags(metadata);
  
  console.log(`Suggested Category: ${category}`); // "Education"
  console.log(`Suggested Tags:`, tags); // ["youtube", "tutorial", "educational", ...]
}

// ========================================
// EXAMPLE 8: Handle Multiple URLs (Batch)
// ========================================
async function batchExtractExample() {
  const urls = [
    'https://www.youtube.com/watch?v=123',
    'https://www.tiktok.com/@user/video/456',
    'https://www.instagram.com/p/ABC/'
  ];
  
  // Extract all in parallel
  const results = await Promise.all(
    urls.map(url => extractVideoMetadata(url))
  );
  
  console.log('Batch Results:', results);
  // All metadata extracted simultaneously
}

// ========================================
// EXAMPLE 9: Error Handling
// ========================================
async function errorHandlingExample() {
  // Even with invalid URLs, service returns valid object
  const invalidUrl = 'not-a-valid-url';
  const metadata = await extractVideoMetadata(invalidUrl);
  
  console.log('Metadata from invalid URL:', metadata);
  /*
  Output will still be valid:
  {
    title: "Video from other",
    description: "",
    thumbnail: "https://via.placeholder.com/300x200?text=Video",
    platform: "other",
    author: "",
    duration: 0,
    publishedAt: "2024-01-01T...",
    url: "not-a-valid-url",
    videoId: null,
    suggestedCategory: "General",
    suggestedTags: ["video", "saved", "watch-later"]
  }
  */
}

// ========================================
// EXAMPLE 10: Integration with Express Route
// ========================================
import express from 'express';
const router = express.Router();

router.post('/extract', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }
    
    // Extract metadata
    const metadata = await extractVideoMetadata(url);
    
    // Return to frontend
    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    // Note: This catch is redundant since extractVideoMetadata never throws
    // but kept for consistency with Express error handling
    res.status(500).json({
      success: false,
      message: 'Failed to extract metadata'
    });
  }
});

export default router;
