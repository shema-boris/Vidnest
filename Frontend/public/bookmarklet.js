// VidNest Bookmarklet - Save any video to VidNest
(function() {
  // Get current page URL and title
  const url = window.location.href;
  const title = document.title;
  
  // Try to get video thumbnail
  const getVideoThumbnail = () => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^#\&\?]*).*/);
      if (videoId && videoId[1]) {
        return `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`;
      }
    }
    
    // Try to find any video thumbnail on the page
    const videoThumbnail = document.querySelector('video[poster]')?.getAttribute('poster');
    if (videoThumbnail) return videoThumbnail;
    
    // Try to find any large image
    const images = document.querySelectorAll('img');
    for (const img of images) {
      if (img.width > 200 && img.height > 200) {
        return img.src;
      }
    }
    
    return '';
  };
  
  const thumbnail = getVideoThumbnail();
  
  // Detect platform
  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'other';
  };
  
  const platform = detectPlatform(url);
  
  // Open VidNest with pre-filled data
  const vidnestUrl = `${window.location.origin}/videos/add?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&thumbnail=${encodeURIComponent(thumbnail)}&platform=${platform}`;
  
  // Open in new tab
  window.open(vidnestUrl, '_blank');
})();


