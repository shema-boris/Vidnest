import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const { isAuthenticated } = useAuth();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [savedVideo, setSavedVideo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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
      saveVideoAutomatically(sharedUrl);
    } else {
      setStatus('error');
      setErrorMessage('No video URL provided. Please use the bookmarklet on a video page.');
    }
  }, [isAuthenticated, navigate, searchParams]);

  // Automatically save video using backend's metadata extraction
  const saveVideoAutomatically = async (url) => {
    try {
      setStatus('loading');
      console.log('[Bookmarklet] Saving video:', url);

      // POST directly to /api/videos - backend extracts metadata automatically
      const response = await api.post('/videos', { url });
      
      console.log('[Bookmarklet] Video saved successfully:', response.data);
      setSavedVideo(response.data);
      setStatus('success');
      
      // Show success toast
      toast.success('Video saved to your library!');
      
    } catch (error) {
      console.error('[Bookmarklet] Error saving video:', error);
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 
        'Failed to save video. The URL might not be a valid video link.'
      );
      toast.error('Failed to save video');
    }
  };

  // Retry saving the video
  const handleRetry = () => {
    const sharedUrl = searchParams.get('url');
    if (sharedUrl) {
      saveVideoAutomatically(sharedUrl);
    }
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

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Spinner size="large" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Saving Video...</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Extracting metadata and saving to your library
          </p>
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Saved!</h1>
            <p className="text-gray-600 text-sm">Successfully added to your library</p>
          </div>

          {/* Video Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            {savedVideo.thumbnail && (
              <img 
                src={savedVideo.thumbnail} 
                alt="Video thumbnail"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{savedVideo.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <span className="capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {savedVideo.platform}
              </span>
              {savedVideo.category && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  {savedVideo.category.name}
                </span>
              )}
            </div>
            {savedVideo.tags && savedVideo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {savedVideo.tags.slice(0, 5).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={goToLibrary}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View in Library
            </button>
            {window.opener && (
              <button
                onClick={closeWindow}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
