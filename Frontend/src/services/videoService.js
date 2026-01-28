import api from '../utils/api';

// Get user's videos with optional query parameters
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
    console.error('Error fetching videos:', error);
    throw error;
  }
};

// Get single video by ID
export const getVideoById = async (id) => {
  try {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video:', error);
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

// Update a video
export const updateVideo = async (id, videoData) => {
  try {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

// Delete a video
export const deleteVideo = async (id) => {
  try {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// Get available tags from user's videos
export const getVideoTags = async () => {
  try {
    const response = await api.get('/videos/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching video tags:', error);
    return [];
  }
};
