import { 
  PlayIcon,
  VideoCameraIcon,
  GlobeAltIcon,
  FilmIcon,
  DevicePhoneMobileIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

// Map of platform names to their display names and icons
const PLATFORMS = {
  youtube: {
    name: 'YouTube',
    icon: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="w-5 h-5 text-[#FF0000]"
        {...props}
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    getEmbedUrl: (url) => {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
    }
  },
  vimeo: {
    name: 'Vimeo',
    icon: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="w-5 h-5 text-[#1AB7EA]"
        {...props}
      >
        <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.5-3.128C5.08 2.701 6.266 1.985 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.675 1.776 3.675.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.063 3.628 1.664 3.493 4.797z" />
      </svg>
    ),
    getEmbedUrl: (url) => {
      const videoId = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
      return videoId ? `https://player.vimeo.com/video/${videoId[1]}` : null;
    }
  },
  tiktok: {
    name: 'TikTok',
    icon: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="w-5 h-5 text-[#000000]"
        {...props}
      >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.08 2.73 1.47 4.17 1.56v4.3c-1.44-.1-2.89-.4-4.2-.9-.55-.23-1.1-.56-1.52-.96-.43-.41-.75-.9-1.02-1.44-.2-.54-.3-1.1-.3-1.66V8.6h4.2v4.18c0 .4.04.8.14 1.18.1.38.27.74.5 1.06.24.32.53.6.87.83.34.23.72.4 1.13.5.41.1.84.15 1.27.15.15 0 .3 0 .45-.02.15 0 .3-.02.45-.04v4.2c-.15.02-.3.03-.45.04-.15.01-.3.02-.45.02-1.5 0-3-.5-4.1-1.38-1.1-.88-1.7-2.1-1.7-3.5V6.4c-1.76.6-3.6 1-5.4 1.1v4.2c0 1.1-.4 2.1-1.1 2.9-.7.8-1.7 1.3-2.8 1.3-.3 0-.6 0-.9-.1-.3-.1-.6-.2-.9-.4-.3-.2-.5-.4-.7-.7-.2-.3-.3-.6-.4-.9-.1-.3-.1-.6-.1-.9 0-1.1.4-2.1 1.1-2.9.7-.8 1.7-1.3 2.8-1.3.3 0 .6 0 .9.1.3.1.6.2.9.4v-4.2c-1.8-.2-3.6.1-5.3.8-1.7.7-3.1 1.8-4.1 3.3-.9 1.5-1.4 3.2-1.4 5v.1c0 1.8.6 3.5 1.7 4.9 1.1 1.4 2.7 2.4 4.5 2.8 1.8.4 3.7.2 5.4-.6 1.7-.8 3-2.1 3.9-3.7.9-1.6 1.3-3.4 1.2-5.2V5.5c.8.7 1.6 1.3 2.5 1.7.9.4 1.9.7 2.9.8v-4.2c-1.5-.3-2.8-1-3.9-2-1.1-1-1.9-2.2-2.3-3.7h-4.1z" />
      </svg>
    ),
    getEmbedUrl: (url) => {
      const videoId = url.match(/(?:tiktok\.com\/.*\/video\/|tiktok\.com\/v\/)(\d+)/i);
      return videoId ? `https://www.tiktok.com/embed/v2/${videoId[1]}` : null;
    }
  },
  instagram: {
    name: 'Instagram',
    icon: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="w-5 h-5 text-[#E1306C]"
        {...props}
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    getEmbedUrl: (url) => {
      const postId = url.match(/(?:instagram\.com\/p\/|reel\/)([a-zA-Z0-9_-]+)/i);
      return postId ? `https://www.instagram.com/p/${postId[1]}/embed` : null;
    }
  },
  default: {
    name: 'Other',
    icon: LinkIcon,
    getEmbedUrl: (url) => url
  }
};

// Get platform information by URL
const getPlatformInfo = (url) => {
  if (!url) return PLATFORMS.default;
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return PLATFORMS.youtube;
  } else if (lowerUrl.includes('vimeo.com')) {
    return PLATFORMS.vimeo;
  } else if (lowerUrl.includes('tiktok.com')) {
    return PLATFORMS.tiktok;
  } else if (lowerUrl.includes('instagram.com')) {
    return PLATFORMS.instagram;
  }
  
  return PLATFORMS.default;
};

// Get platform icon component
const getPlatformIcon = (platform) => {
  if (!platform) return PLATFORMS.default.icon;
  const platformKey = Object.keys(PLATFORMS).find(key => 
    PLATFORMS[key].name.toLowerCase() === platform.toLowerCase()
  );
  return platformKey ? PLATFORMS[platformKey].icon : PLATFORMS.default.icon;
};

// Get platform name from URL
const getPlatformName = (url) => {
  return getPlatformInfo(url).name;
};

// Get embed URL for a video
const getEmbedUrl = (url) => {
  return getPlatformInfo(url).getEmbedUrl(url);
};

export {
  getPlatformInfo,
  getPlatformIcon,
  getPlatformName,
  getEmbedUrl,
  PLATFORMS
};
