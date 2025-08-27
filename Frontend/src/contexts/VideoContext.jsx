import { createContext, useContext, useState, useCallback, useEffect } from 'react';
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

  // Fetch videos with current search parameters
  const {
    data: videosData = { videos: [], total: 0, totalPages: 1 },
    isLoading: isLoadingVideos,
    isError: isVideosError,
    error: videosError,
    refetch: refetchVideos,
  } = useQuery({
    queryKey: ['userVideos', searchParams],
    queryFn: () => videoService.getUserVideos(searchParams),
    enabled: isAuthenticated, // Only fetch if user is authenticated
    keepPreviousData: true,
  });

  // Refetch videos when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      refetchVideos();
    }
  }, [isAuthenticated, refetchVideos]);

  // Fetch available tags
  const { data: availableTags = [] } = useQuery({
    queryKey: ['videoTags'],
    queryFn: videoService.getVideoTags,
    enabled: isAuthenticated,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Fetch single video
  const getVideo = useCallback((videoId) => {
    return queryClient.fetchQuery({
      queryKey: ['video', videoId],
      queryFn: () => videoService.getVideoById(videoId),
    });
  }, [queryClient]);

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: videoService.createVideo,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['userVideos']);
      toast.success('Video added successfully');
      navigate(`/videos/${data._id}`);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to add video';
      if (error.response?.status === 400 && errorMessage.includes('already been added')) {
        toast.error('This video has already been added to your collection');
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Update video mutation
  const updateVideoMutation = useMutation({
    mutationFn: ({ id, ...data }) => videoService.updateVideo(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['userVideos']);
      queryClient.invalidateQueries(['video', data._id]);
      toast.success('Video updated successfully');
      navigate(`/videos/${data._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update video');
    },
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: videoService.deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(['userVideos']);
      toast.success('Video deleted successfully');
      navigate('/videos');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete video');
    },
  });

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

  // Handle video view increment
  const handleViewIncrement = useCallback(async (videoId) => {
    try {
      await videoService.incrementVideoViews(videoId);
      queryClient.invalidateQueries(['video', videoId]);
    } catch (error) {
      console.error('Failed to increment video views:', error);
    }
  }, [queryClient]);

  // Handle video upload
  const uploadVideoFile = useCallback(async (file, onUploadProgress) => {
    try {
      const response = await videoService.uploadVideoFile(file, onUploadProgress);
      return response;
    } catch (error) {
      console.error('Failed to upload video file:', error);
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
    availableTags,
    searchParams,
    
    // Actions
    getVideo,
    handleSearch,
    handlePageChange,
    handleViewIncrement,
    uploadVideoFile,
    
    // Mutations
    createVideo: createVideoMutation.mutateAsync,
    updateVideo: updateVideoMutation.mutateAsync,
    deleteVideo: deleteVideoMutation.mutate,
    isCreating: createVideoMutation.isLoading,
    isUpdating: updateVideoMutation.isLoading,
    isDeleting: deleteVideoMutation.isLoading,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export default VideoContext;
