import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

/**
 * SharePage - Desktop Bookmarklet Flow
 * 
 * Handles video saving from desktop bookmarklet clicks.
 * Similar to ShareTarget (mobile) but optimized for desktop popup window.
 */
const SharePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  
  const [status, setStatus] = useState('loading'); // loading, preview, saving, success, error
  const [metadata, setMetadata] = useState(null);
  const [categories, setCategories] = useState([]);
  const [savedVideo, setSavedVideo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: []
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const currentUrl = `/share?${searchParams.toString()}`;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // Extract URL from query params
    const sharedUrl = searchParams.get('url');
    
    if (sharedUrl) {
      fetchMetadataPreview(sharedUrl);
      fetchCategories();
    } else {
      setStatus('error');
      setErrorMessage('No video URL provided. Please use the bookmarklet on a video page.');
    }
  }, [isAuthenticated, navigate, searchParams]);

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch metadata preview without saving
  const fetchMetadataPreview = async (url) => {
    try {
      setStatus('loading');
      console.log('[Bookmarklet] Fetching metadata for:', url);

      const response = await api.get(`/share/metadata?url=${encodeURIComponent(url)}`);
      const extractedMetadata = response.data.data;
      
      console.log('[Bookmarklet] Metadata extracted:', extractedMetadata);
      setMetadata(extractedMetadata);
      
      // Pre-fill form with extracted metadata
      setFormData({
        title: extractedMetadata.title || '',
        description: extractedMetadata.description || '',
        category: '', // Let user choose
        tags: extractedMetadata.suggestedTags || []
      });
      
      setStatus('preview');
    } catch (error) {
      console.error('[Bookmarklet] Error fetching metadata:', error);
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 
        'Failed to extract video metadata. The URL might not be valid.'
      );
      toast.error('Failed to extract metadata');
    }
  };

  // Save video with user-edited metadata
  const saveVideo = async () => {
    try {
      setStatus('saving');
      const sharedUrl = searchParams.get('url');
      console.log('[Bookmarklet] Saving video with edited metadata:', formData);

      const response = await api.post('/videos', { 
        url: sharedUrl,
        title: formData.title,
        description: formData.description,
        category: formData.category || null,
        tags: formData.tags
      });
      
      console.log('[Bookmarklet] Video saved successfully:', response.data);
      setSavedVideo(response.data);
      setStatus('success');
      
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries(['userVideos']);
      
      // Show success toast
      toast.success('Video saved to your library!');
      
    } catch (error) {
      console.error('[Bookmarklet] Error saving video:', error);
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 
        'Failed to save video. Please try again.'
      );
      toast.error('Failed to save video');
    }
  };

  // Retry fetching metadata
  const handleRetry = () => {
    const sharedUrl = searchParams.get('url');
    if (sharedUrl) {
      fetchMetadataPreview(sharedUrl);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle tag input (comma-separated)
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  // Navigate to video library
  const goToLibrary = () => {
    navigate('/videos');
  };

  // Close the popup window (if opened from bookmarklet)
  const closeWindow = () => {
    // Try to close if it's a popup
    if (window.opener) {
      window.close();
    } else {
      // If not a popup, navigate to library
      navigate('/videos');
    }
  };

  // Loading state (fetching metadata)
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Spinner size="large" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Extracting Metadata...</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Analyzing video information
          </p>
        </div>
      </div>
    );
  }

  // Saving state
  if (status === 'saving') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Spinner size="large" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Saving Video...</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Adding to your library
          </p>
        </div>
      </div>
    );
  }

  // Preview/Edit state
  if (status === 'preview' && metadata) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Review & Save Video</h1>
            
            {/* Video Preview */}
            {metadata.thumbnail && (
              <div className="mb-6">
                <img 
                  src={metadata.thumbnail} 
                  alt="Video thumbnail"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Editable Form */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select a category (optional) --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {metadata.suggestedCategory && (
                  <p className="mt-1 text-xs text-gray-500">
                    Suggested: {metadata.suggestedCategory}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="e.g., tutorial, coding, javascript"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Platform & Author Info */}
              <div className="flex gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">Platform:</span>
                <span className="capitalize">{metadata.platform}</span>
                {metadata.author && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="font-medium">Author:</span>
                    <span>{metadata.author}</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={saveVideo}
                disabled={!formData.title}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Save Video to Library
              </button>
              <button
                onClick={closeWindow}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Failed to Save Video</h1>
          <p className="text-gray-600 mb-6 text-sm">{errorMessage}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={goToLibrary}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Go to Library
            </button>
            {window.opener && (
              <button
                onClick={closeWindow}
                className="w-full bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 text-sm"
              >
                Close Window
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success' && savedVideo) {
    // Format date to relative time (e.g., "Just now")
    const timeAgo = (date) => {
      if (!date) return '';
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      return seconds < 60 ? 'Just now' : 'A moment ago';
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-lg w-full">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Saved!</h1>
            <p className="text-gray-600 text-sm">Successfully added to your library</p>
          </div>

          {/* Rich Video Card Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              {savedVideo.thumbnail ? (
                <img 
                  src={savedVideo.thumbnail} 
                  alt={savedVideo.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Duration badge if available */}
              {savedVideo.duration && savedVideo.duration > 0 && (
                <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-70 px-1.5 py-0.5 text-xs font-medium text-white">
                  {Math.floor(savedVideo.duration / 60)}:{(savedVideo.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* Title and Platform */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                  {savedVideo.title}
                </h3>
                <span className="ml-2 capitalize px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex-shrink-0">
                  {savedVideo.platform}
                </span>
              </div>

              {/* Description if available */}
              {savedVideo.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {savedVideo.description}
                </p>
              )}

              {/* Metadata row */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{timeAgo(savedVideo.createdAt)}</span>
                </div>
                
                {savedVideo.metadata?.author && (
                  <div className="flex items-center">
                    <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate max-w-[150px]">{savedVideo.metadata.author}</span>
                  </div>
                )}
              </div>

              {/* Category */}
              {savedVideo.category && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {savedVideo.category.name}
                  </span>
                </div>
              )}

              {/* Tags */}
              {savedVideo.tags && savedVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {savedVideo.tags.slice(0, 5).map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {savedVideo.tags.length > 5 && (
                    <span className="text-xs text-gray-500 py-1">
                      +{savedVideo.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={goToLibrary}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              View in Library
            </button>
            {window.opener && (
              <button
                onClick={closeWindow}
                className="w-full bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300"
              >
                Close Window
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback (should never reach here)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">Processing...</p>
      </div>
    </div>
  );
};

export default SharePage;
