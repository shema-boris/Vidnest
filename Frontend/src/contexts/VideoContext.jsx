import { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as videoService from '../services/videoService';
import { useAuth } from './AuthContext';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [searchParams, setSearchParams] = useState({
    query: '',
    tags: [],
    sort: 'newest',
    page: 1,
    limit: 12,
  });

  // Fetch user's videos
  const {
    data: videosData = { videos: [], total: 0, totalPages: 1 },
    isLoading: isLoadingVideos,
    isError: isVideosError,
    error: videosError,
  } = useQuery({
    queryKey: ['userVideos', searchParams],
    queryFn: () => videoService.getUserVideos(searchParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
  });

  // Fetch single video
  const getVideo = useCallback(async (id) => {
    try {
      const video = await videoService.getVideoById(id);
      return video;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }, []);

  // Create video
  const createVideo = useCallback(async (videoData) => {
    try {
      const newVideo = await videoService.createVideo(videoData);
      queryClient.invalidateQueries(['userVideos']);
      toast.success('Video saved successfully');
      return newVideo;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  }, [queryClient]);

  // Update video
  const updateVideo = useCallback(async (id, videoData) => {
    try {
      const updatedVideo = await videoService.updateVideo(id, videoData);
      queryClient.invalidateQueries(['userVideos']);
      queryClient.invalidateQueries(['video', id]);
      toast.success('Video updated successfully');
      return updatedVideo;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }, [queryClient]);

  // Delete video
  const deleteVideo = useCallback(async (id) => {
    try {
      await videoService.deleteVideo(id);
      queryClient.invalidateQueries(['userVideos']);
      toast.success('Video deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }, [queryClient]);

  // Handle search
  const handleSearch = useCallback((params) => {
    setSearchParams(prev => ({
      ...prev,
      ...params,
      page: 1, // Reset to first page on new search
    }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page) => {
    setSearchParams(prev => ({
      ...prev,
      page,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle file upload
  const uploadVideoFile = useCallback(async (file, onUploadProgress) => {
    try {
      const response = await videoService.uploadVideoFile(file, onUploadProgress);
      return response;
    } catch (error) {
      console.error('Error uploading video file:', error);
      throw error;
    }
  }, []);

  const value = {
    // State
    videos: videosData.videos,
    totalVideos: videosData.total,
    totalPages: videosData.totalPages,
    currentPage: searchParams.page,
    isLoadingVideos,
    isVideosError,
    videosError,
    searchParams,
    
    // Actions
    getVideo,
    createVideo,
    updateVideo,
    deleteVideo,
    handleSearch,
    handlePageChange,
    uploadVideoFile,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export default VideoContext;
