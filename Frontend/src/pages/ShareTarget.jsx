import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const ShareTarget = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [savedVideo, setSavedVideo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=/share-target/');
      return;
    }

    // Extract URL from share target params
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('url') || urlParams.get('text');
    
    if (sharedUrl) {
      saveVideoAutomatically(sharedUrl);
    } else {
      setStatus('error');
      setErrorMessage('No video URL was shared.');
    }
  }, [isAuthenticated, navigate]);

  // Automatically save video using backend's metadata extraction
  const saveVideoAutomatically = async (url) => {
    try {
      setStatus('loading');
      console.log('Saving shared video:', url);

      // POST directly to /api/videos - backend extracts metadata automatically
      const response = await api.post('/videos', { url });
      
      console.log('Video saved successfully:', response.data);
      setSavedVideo(response.data);
      setStatus('success');
      
      // Show success toast
      toast.success('Video saved to your library!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/videos');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving shared video:', error);
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 
        'Failed to save video. Please try again.'
      );
      toast.error('Failed to save video');
    }
  };

  // Retry saving the video
  const handleRetry = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('url') || urlParams.get('text');
    if (sharedUrl) {
      saveVideoAutomatically(sharedUrl);
    }
  };

  // Navigate to video library
  const goToLibrary = () => {
    navigate('/videos');
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="large" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Saving Video...</h2>
          <p className="mt-2 text-gray-600">Extracting metadata and saving to your library</p>
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
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={goToLibrary}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to Library
            </button>
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
            <p className="text-gray-600">Successfully added to your library</p>
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
            <h3 className="font-semibold text-gray-900 mb-2">{savedVideo.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="capitalize">{savedVideo.platform}</span>
              {savedVideo.category && (
                <>
                  <span>•</span>
                  <span>{savedVideo.category.name}</span>
                </>
              )}
            </div>
            {savedVideo.tags && savedVideo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {savedVideo.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={goToLibrary}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View in Library
          </button>
          <p className="text-sm text-gray-500 text-center mt-3">Redirecting in 2 seconds...</p>
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

export default ShareTarget;


