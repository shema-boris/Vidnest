import api from '../utils/api';

// Get public videos with optional query parameters
export const getPublicVideos = async ({ query = '', tags = [], sort = 'newest', page = 1, limit = 12 } = {}) => {
  try {
    const params = new URLSearchParams({
      query,
      sort,
      page: page.toString(),
      limit: limit.toString(),
      ...(tags.length > 0 && { tags: tags.join(',') })
    });
    
    const response = await api.get(`/videos/public?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public videos:', error);
    throw error;
  }
};

// Get authenticated user's videos with optional query parameters
export const getUserVideos = async ({ query = '', tags = [], sort = 'newest', page = 1, limit = 12 } = {}) => {
  try {
    const params = new URLSearchParams({
      query,
      sort,
      page: page.toString(),
      limit: limit.toString(),
      ...(tags.length > 0 && { tags: tags.join(',') })
    });
    
    const response = await api.get(`/videos?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user videos:', error);
    throw error;
  }
};

// Keep getVideos as an alias for getUserVideos for backward compatibility
export const getVideos = getUserVideos;

// Get a single video by ID
export const getVideoById = async (id) => {
  try {
    const response = await api.get(`/videos/public/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching video ${id}:`, error);
    throw error;
  }
};

// Create a new video
export const createVideo = async (videoData) => {
  try {
    const response = await api.post('/videos', videoData);
    return response.data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

// Update an existing video
export const updateVideo = async (id, videoData) => {
  try {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  } catch (error) {
    console.error(`Error updating video ${id}:`, error);
    throw error;
  }
};

// Delete a video
export const deleteVideo = async (id) => {
  try {
    await api.delete(`/videos/${id}`);
  } catch (error) {
    console.error(`Error deleting video ${id}:`, error);
    throw error;
  }
};

// Get all available tags
export const getVideoTags = async () => {
  try {
    const response = await api.get('/videos/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching video tags:', error);
    return [];
  }
};

// Increment video views
export const incrementVideoViews = async (id) => {
  try {
    await api.post(`/videos/${id}/views`);
  } catch (error) {
    console.error(`Error incrementing views for video ${id}:`, error);
  }
};

// Upload video file
export const uploadVideoFile = async (file, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading video file:', error);
    throw error;
  }
};
