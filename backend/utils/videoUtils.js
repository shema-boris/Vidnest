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
