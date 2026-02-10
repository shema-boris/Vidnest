// @desc    Extract video ID from URL based on platform
// @param   {string} url - The video URL
// @param   {string} platform - The video platform (optional)
// @return  {string|null} - The extracted video ID or null if not found
export const extractVideoId = (url, platform = null) => {
  if (!url) return null;

  // If platform is not provided, try to detect it
  if (!platform) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube';
    } else if (url.includes('tiktok.com')) {
      platform = 'tiktok';
    } else if (url.includes('instagram.com')) {
      platform = 'instagram';
    } else {
      return null;
    }
  }

  try {
    switch (platform.toLowerCase()) {
      case 'youtube':
        // Handle youtu.be links
        if (url.includes('youtu.be/')) {
          return url.split('youtu.be/')[1].split('?')[0];
        }
        // Handle youtube.com links
        const youtubeMatch = url.match(/(?:v=|\/v\/|\/embed\/|\/v=|\/e\/|watch\?v=)([^#\&\?]*).*/);
        return youtubeMatch ? youtubeMatch[1] : null;

      case 'tiktok':
        // Handle tiktok.com links
        const tiktokMatch = url.match(/(?:tiktok\.com\/.*\/video\/|\/v\/)(\d+)/);
        return tiktokMatch ? tiktokMatch[1] : null;

      case 'instagram':
        // Handle instagram.com links
        const instagramMatch = url.match(/(?:reel\/|p\/|tv\/)([^/?#&]+)/);
        return instagramMatch ? instagramMatch[1] : null;

      default:
        return null;
    }
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return null;
  }
};

// @desc    Get platform from URL
// @param   {string} url - The video URL
// @return  {string} - The detected platform or 'other'
export const getPlatformFromUrl = (url) => {
  if (!url) return 'other';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('tiktok.com')) {
    return 'tiktok';
  } else if (url.includes('instagram.com')) {
    return 'instagram';
  }
  
  return 'other';
};

// @desc    Normalize a video URL to a canonical form for duplicate detection
// @param   {string} url - The video URL
// @return  {string} - Normalized URL
export const normalizeVideoUrl = (url) => {
  if (!url) return '';

  try {
    let normalized = url.trim();

    // Ensure URL has a protocol
    if (!normalized.startsWith('http')) {
      normalized = `https://${normalized}`;
    }

    const urlObj = new URL(normalized);

    // Remove common tracking parameters
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'si', 'feature', 'fbclid', 'gclid', 'ref', 'source', 'igshid', 'igsh'];
    trackingParams.forEach(param => urlObj.searchParams.delete(param));

    // Remove trailing slashes
    urlObj.pathname = urlObj.pathname.replace(/\/+$/, '');

    // Remove www prefix
    urlObj.hostname = urlObj.hostname.replace(/^www\./, '');

    // Platform-specific normalization
    const host = urlObj.hostname.toLowerCase();

    // YouTube: youtu.be → youtube.com, m.youtube.com → youtube.com
    if (host === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
      return `https://youtube.com/watch?v=${videoId}`;
    }
    if (host === 'm.youtube.com' || host === 'youtube.com') {
      urlObj.hostname = 'youtube.com';
      // For shorts, normalize to watch URL
      const shortsMatch = urlObj.pathname.match(/^\/shorts\/(.+)/);
      if (shortsMatch) {
        return `https://youtube.com/watch?v=${shortsMatch[1]}`;
      }
      // Keep only the v parameter for watch URLs
      if (urlObj.searchParams.has('v')) {
        return `https://youtube.com/watch?v=${urlObj.searchParams.get('v')}`;
      }
    }

    // TikTok: vm.tiktok.com, vt.tiktok.com, m.tiktok.com → tiktok.com
    if (host.endsWith('tiktok.com')) {
      urlObj.hostname = 'tiktok.com';
    }

    // Instagram: instagr.am → instagram.com
    if (host === 'instagr.am' || host.endsWith('instagram.com')) {
      urlObj.hostname = 'instagram.com';
    }

    // Facebook: m.facebook.com → facebook.com, fb.watch → keep as is
    if (host === 'm.facebook.com') {
      urlObj.hostname = 'facebook.com';
    }

    // Twitter: mobile.twitter.com → twitter.com
    if (host === 'mobile.twitter.com') {
      urlObj.hostname = 'twitter.com';
    }

    return urlObj.toString().replace(/\/+$/, '');
  } catch (error) {
    // If URL parsing fails, just return trimmed lowercase
    return url.trim().toLowerCase();
  }
};

// @desc    Format duration in seconds to HH:MM:SS
// @param   {number} seconds - Duration in seconds
// @return  {string} - Formatted duration
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '00:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } else {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
};

// @desc    Parse duration string to seconds
// @param   {string} duration - Duration string (HH:MM:SS or MM:SS)
// @return  {number} - Duration in seconds
export const parseDuration = (duration) => {
  if (!duration) return 0;
  
  const parts = duration.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  }
  
  return 0;
};
