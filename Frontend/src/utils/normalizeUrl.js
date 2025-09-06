// src/utils/normalizeUrl.js
export const normalizeUrl = (url) => {
    if (!url) return '#';
  
    // Handle YouTube short links
    if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
  
    // Handle Vimeo
    if (url.includes('vimeo.com')) {
      return url.startsWith('http') ? url : `https://${url}`;
    }
  
    // Default: ensure http(s)
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
  
    return url;
  };
  