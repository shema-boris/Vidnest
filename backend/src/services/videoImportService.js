import axios from 'axios';

// @desc    Extract video metadata from URL using multiple methods
// @param   {string} url - The video URL
// @return  {object} - Complete metadata with suggestions
export const extractVideoMetadata = async (url) => {
  try {
    // Validate URL
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // First try Microlink.io for universal metadata
    const microlinkData = await extractWithMicrolink(url);
    if (microlinkData) {
      // Add suggestions to Microlink data
      const completeMetadata = enrichMetadata(microlinkData, url);
      return completeMetadata;
    }

    // Fallback to basic URL parsing
    const basicData = extractBasicMetadata(url);
    return enrichMetadata(basicData, url);
  } catch (error) {
    console.error('Error extracting metadata:', error);
    // Always return valid metadata structure even on error
    const fallbackData = extractBasicMetadata(url);
    return enrichMetadata(fallbackData, url);
  }
};

// @desc    Enrich metadata with suggestions and ensure complete structure
// @param   {object} metadata - Base metadata
// @param   {string} url - Original URL
// @return  {object} - Complete metadata structure
const enrichMetadata = (metadata, url) => {
  // Ensure all required fields exist
  const platform = metadata.platform || detectPlatform(url);
  const completeMetadata = {
    title: metadata.title || 'Untitled Video',
    description: metadata.description || '',
    thumbnail: (metadata.thumbnail && metadata.thumbnail.trim() !== '') ? metadata.thumbnail : getDefaultThumbnail(platform, url),
    platform: platform,
    author: metadata.author || '',
    duration: metadata.duration || 0,
    publishedAt: metadata.publishedAt || new Date().toISOString(),
    url: url,
    videoId: extractVideoId(url, platform),
  };

  // Add AI suggestions
  completeMetadata.suggestedCategory = suggestCategory(completeMetadata);
  completeMetadata.suggestedTags = suggestTags(completeMetadata);

  return completeMetadata;
};

// @desc    Extract metadata using Microlink.io
// @param   {string} url - The video URL
// @return  {object|null} - Extracted metadata or null
const extractWithMicrolink = async (url) => {
  try {
    const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
    const response = await axios.get(microlinkUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'VidNest/1.0'
      }
    });

    if (response.data && response.data.data) {
      const data = response.data.data;
      
      // Extract duration if available (Microlink sometimes provides video metadata)
      let duration = 0;
      if (data.video?.duration) {
        duration = parseInt(data.video.duration, 10);
      }

      // Get platform and try to build platform-specific thumbnail
      const platform = detectPlatform(url);
      let thumbnail = data.image?.url || data.logo?.url || '';
      
      // For YouTube, try to build thumbnail from video ID if Microlink didn't provide one
      if (platform === 'youtube' && (!thumbnail || thumbnail.trim() === '')) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
          // Use hqdefault which is guaranteed to exist for all videos
          thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }

      return {
        title: data.title || '',
        description: data.description || '',
        thumbnail: thumbnail,
        author: data.author || data.publisher || '',
        platform: platform,
        duration: duration,
        publishedAt: data.date || new Date().toISOString(),
        siteName: data.publisher || platform
      };
    }
    return null;
  } catch (error) {
    console.error('Microlink extraction failed:', error.message);
    return null;
  }
};

// @desc    Extract basic metadata from URL
// @param   {string} url - The video URL
// @return  {object} - Basic metadata
const extractBasicMetadata = (url) => {
  const platform = detectPlatform(url);
  
  return {
    title: `Video from ${platform}`,
    description: '',
    thumbnail: getDefaultThumbnail(platform, url),
    author: '',
    platform: platform,
    publishedAt: new Date().toISOString(),
    siteName: platform
  };
};

// @desc    Detect platform from URL
// @param   {string} url - The video URL
// @return  {string} - Platform name
export const detectPlatform = (url) => {
  if (!url) return 'other';
  
  const urlLower = url.toLowerCase();
  
  // YouTube: youtube.com, youtu.be, m.youtube.com
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  }
  // TikTok: tiktok.com, vm.tiktok.com, vt.tiktok.com, m.tiktok.com
  if (urlLower.includes('tiktok.com')) {
    return 'tiktok';
  }
  // Instagram: instagram.com, instagr.am
  if (urlLower.includes('instagram.com') || urlLower.includes('instagr.am')) {
    return 'instagram';
  }
  // Facebook: facebook.com, fb.com, fb.watch, m.facebook.com
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com') || urlLower.includes('fb.watch')) {
    return 'facebook';
  }
  // Twitter/X: twitter.com, x.com, mobile.twitter.com
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'twitter';
  }
  // Vimeo: vimeo.com, player.vimeo.com
  if (urlLower.includes('vimeo.com')) {
    return 'vimeo';
  }
  
  return 'other';
};

// @desc    Get default thumbnail for platform
// @param   {string} platform - Platform name
// @param   {string} url - Optional URL to extract video ID for better thumbnails
// @return  {string} - Default thumbnail URL
const getDefaultThumbnail = (platform, url = null) => {
  // Try to generate YouTube thumbnail from video ID
  if (platform === 'youtube' && url) {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      // Use hqdefault which is guaranteed to exist for all videos (480x360)
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  
  const thumbnails = {
    youtube: 'https://via.placeholder.com/1280x720/FF0000/FFFFFF?text=YouTube+Video',
    tiktok: 'https://via.placeholder.com/720x1280/000000/FFFFFF?text=TikTok+Video',
    instagram: 'https://via.placeholder.com/1080x1080/E4405F/FFFFFF?text=Instagram+Video',
    facebook: 'https://via.placeholder.com/1280x720/1877F2/FFFFFF?text=Facebook+Video',
    twitter: 'https://via.placeholder.com/1280x720/1DA1F2/FFFFFF?text=Twitter+Video',
    vimeo: 'https://via.placeholder.com/1280x720/1AB7EA/FFFFFF?text=Vimeo+Video',
    other: 'https://via.placeholder.com/1280x720/6B7280/FFFFFF?text=Video'
  };
  
  return thumbnails[platform] || thumbnails.other;
};

// @desc    Extract YouTube video ID from URL
// @param   {string} url - YouTube URL
// @return  {string|null} - Video ID or null
export const extractYouTubeId = (url) => {
  const patterns = [
    // Standard watch URLs: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#\&\?]*).*/,
    // Mobile URLs: m.youtube.com/watch?v=VIDEO_ID
    /m\.youtube\.com\/watch\?v=([^#\&\?]*).*/,
    // Shorts: youtube.com/shorts/VIDEO_ID
    /youtube\.com\/shorts\/([^#\&\?]*).*/,
    // Old embed format: youtube.com/v/VIDEO_ID
    /youtube\.com\/v\/([^#\&\?]*).*/,
    // User uploads: youtube.com/user/.../VIDEO_ID
    /youtube\.com\/user\/[^\/]*\/#\w\/\w\/([^#\&\?]*).*/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// @desc    Extract video ID from any platform
// @param   {string} url - Video URL
// @param   {string} platform - Platform name
// @return  {string|null} - Video ID or null
export const extractVideoId = (url, platform) => {
  if (!url) return null;

  try {
    switch (platform) {
      case 'youtube':
        return extractYouTubeId(url);

      case 'tiktok':
        // TikTok video URLs: tiktok.com/@username/video/1234567890
        // Also handles: vm.tiktok.com/CODE, vt.tiktok.com/CODE
        let tiktokMatch = url.match(/\/video\/(\d+)/);
        if (tiktokMatch) return tiktokMatch[1];
        // Handle short URLs: vm.tiktok.com/ZS... or vt.tiktok.com/ZS...
        tiktokMatch = url.match(/(?:vm|vt)\.tiktok\.com\/([A-Za-z0-9]+)/);
        return tiktokMatch ? tiktokMatch[1] : null;

      case 'instagram':
        // Instagram URLs: instagram.com/p/CODE or instagram.com/reel/CODE
        const instagramMatch = url.match(/(?:\/p\/|\/reel\/|\/tv\/)([A-Za-z0-9_-]+)/);
        return instagramMatch ? instagramMatch[1] : null;

      case 'facebook':
        // Facebook video URLs vary, try to extract numeric ID
        // Handles: facebook.com/username/videos/123, fb.watch/abc, m.facebook.com/...
        let facebookMatch = url.match(/\/videos\/(\d+)/);
        if (facebookMatch) return facebookMatch[1];
        // Handle fb.watch short URLs
        facebookMatch = url.match(/fb\.watch\/([A-Za-z0-9_-]+)/);
        if (facebookMatch) return facebookMatch[1];
        // Handle story/reel IDs
        facebookMatch = url.match(/\/(?:reel|story)\/(\d+)/);
        return facebookMatch ? facebookMatch[1] : null;

      case 'twitter':
        // Twitter video URLs: twitter.com/user/status/1234567890
        const twitterMatch = url.match(/\/status\/(\d+)/);
        return twitterMatch ? twitterMatch[1] : null;

      case 'vimeo':
        // Vimeo URLs: vimeo.com/1234567890
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        return vimeoMatch ? vimeoMatch[1] : null;

      default:
        // Try to extract any numeric ID from the URL path
        const genericMatch = url.match(/\/(\d{6,})/);
        return genericMatch ? genericMatch[1] : null;
    }
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return null;
  }
};

// @desc    Suggest category based on content
// @param   {object} metadata - Video metadata
// @return  {string} - Suggested category
export const suggestCategory = (metadata) => {
  const title = (metadata.title || '').toLowerCase();
  const description = (metadata.description || '').toLowerCase();
  const platform = metadata.platform || '';
  
  // Platform-based suggestions
  if (platform === 'youtube') {
    if (title.includes('tutorial') || title.includes('how to')) return 'Education';
    if (title.includes('music') || title.includes('song')) return 'Music';
    if (title.includes('gaming') || title.includes('game')) return 'Gaming';
  }
  
  if (platform === 'tiktok') {
    if (title.includes('cooking') || title.includes('recipe')) return 'Food';
    if (title.includes('dance') || title.includes('dancing')) return 'Entertainment';
    if (title.includes('comedy') || title.includes('funny')) return 'Comedy';
  }
  
  if (platform === 'instagram') {
    if (title.includes('fashion') || title.includes('style')) return 'Fashion';
    if (title.includes('travel') || title.includes('trip')) return 'Travel';
    if (title.includes('fitness') || title.includes('workout')) return 'Fitness';
  }
  
  // Content-based suggestions
  const content = `${title} ${description}`;
  if (content.includes('news') || content.includes('update')) return 'News';
  if (content.includes('review') || content.includes('unboxing')) return 'Reviews';
  if (content.includes('live') || content.includes('stream')) return 'Live';
  
  return 'General';
};

// @desc    Suggest tags based on content
// @param   {object} metadata - Video metadata
// @return  {array} - Suggested tags (3-5 tags)
export const suggestTags = (metadata) => {
  const title = (metadata.title || '').toLowerCase();
  const description = (metadata.description || '').toLowerCase();
  const platform = metadata.platform || '';
  const author = (metadata.author || '').toLowerCase();
  
  const tags = new Set(); // Use Set to avoid duplicates
  
  // Always include platform as first tag
  if (platform && platform !== 'other') {
    tags.add(platform);
  }
  
  // Combine all text for analysis
  const content = `${title} ${description} ${author}`;
  
  // Category-based tags
  const tagKeywords = {
    'tutorial': ['tutorial', 'how to', 'guide', 'learn', 'course'],
    'comedy': ['funny', 'comedy', 'laugh', 'hilarious', 'humor'],
    'music': ['music', 'song', 'audio', 'sound', 'beat'],
    'gaming': ['gaming', 'game', 'gameplay', 'play', 'gamer'],
    'cooking': ['cooking', 'recipe', 'food', 'chef', 'kitchen'],
    'fitness': ['fitness', 'workout', 'exercise', 'gym', 'training'],
    'travel': ['travel', 'trip', 'vacation', 'destination', 'adventure'],
    'fashion': ['fashion', 'style', 'outfit', 'clothing', 'wear'],
    'tech': ['tech', 'technology', 'gadget', 'device', 'digital'],
    'news': ['news', 'breaking', 'update', 'report', 'latest'],
    'review': ['review', 'unboxing', 'test', 'comparison'],
    'vlog': ['vlog', 'daily', 'life', 'day in'],
    'educational': ['education', 'teaching', 'lesson', 'school'],
    'entertainment': ['entertainment', 'fun', 'show'],
    'sports': ['sports', 'athlete', 'match', 'competition'],
    'diy': ['diy', 'craft', 'handmade', 'build'],
    'beauty': ['beauty', 'makeup', 'skincare', 'cosmetic'],
    'live': ['live', 'streaming', 'stream'],
    'short': ['short', 'shorts', 'quick', 'reel']
  };
  
  // Check content against keyword patterns
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        tags.add(tag);
        break; // Only add tag once per category
      }
    }
  }
  
  // Platform-specific tags
  if (platform === 'tiktok') {
    tags.add('short-form');
  } else if (platform === 'youtube' && content.includes('shorts')) {
    tags.add('short-form');
  }
  
  // Convert Set to Array
  const tagArray = Array.from(tags);
  
  // Ensure we have 3-5 tags
  if (tagArray.length < 3) {
    // Add generic tags based on platform if we don't have enough
    const genericTags = ['video', 'saved', 'watch-later'];
    for (const genericTag of genericTags) {
      if (tagArray.length >= 3) break;
      if (!tagArray.includes(genericTag)) {
        tagArray.push(genericTag);
      }
    }
  }
  
  // Return 3-5 tags (slice if more than 5)
  return tagArray.slice(0, 5);
};

/**
 * ========================================
 * VIDEO IMPORT SERVICE - COMPLETE API
 * ========================================
 * 
 * This service provides video metadata extraction from URLs.
 * All functions are reusable across different ingestion paths:
 * - ShareTarget PWA
 * - Bookmarklet
 * - Browser Extension
 * - Manual Add Video form
 * 
 * MAIN FUNCTION:
 * ----------------------------------------
 * extractVideoMetadata(url) -> Promise<Object>
 *   Returns complete metadata structure:
 *   {
 *     title: string,
 *     description: string,
 *     thumbnail: string,
 *     platform: string (youtube, tiktok, instagram, facebook, twitter, vimeo, other),
 *     author: string,
 *     duration: number (seconds),
 *     publishedAt: string (ISO date),
 *     url: string,
 *     videoId: string | null,
 *     suggestedCategory: string,
 *     suggestedTags: string[] (3-5 tags)
 *   }
 * 
 * EXPORTED HELPER FUNCTIONS:
 * ----------------------------------------
 * detectPlatform(url) -> string
 *   Detects video platform from URL
 * 
 * extractYouTubeId(url) -> string | null
 *   Extracts YouTube video ID
 * 
 * extractVideoId(url, platform) -> string | null
 *   Extracts video ID for any platform
 * 
 * suggestCategory(metadata) -> string
 *   Suggests category based on content
 * 
 * suggestTags(metadata) -> string[]
 *   Suggests 3-5 tags based on content
 * 
 * EXTRACTION STRATEGY:
 * ----------------------------------------
 * 1. Try Microlink.io API (10s timeout)
 * 2. Fallback to basic URL parsing
 * 3. Always return valid metadata structure
 * 4. Enrich with AI suggestions
 * 
 * ERROR HANDLING:
 * ----------------------------------------
 * - Never throws errors
 * - Always returns valid metadata object
 * - Graceful fallbacks at every step
 * - Logs errors for debugging
 */
