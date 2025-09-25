import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch link preview data
 * @param {string} url - The URL to fetch preview for
 * @returns {Object} - Preview data and loading/error states
 */
const useLinkPreview = (url) => {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url) {
        setPreview(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/preview?url=${encodeURIComponent(url)}`);
        setPreview({
          title: response.data.title,
          description: response.data.description,
          image: response.data.image,
          url: response.data.url,
          siteName: response.data.siteName,
          favicon: response.data.favicon
        });
      } catch (err) {
        console.error('Error fetching link preview:', err);
        setError(err.response?.data?.message || 'Failed to load preview');
        setPreview(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call
    const timer = setTimeout(() => {
      fetchPreview();
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  return { preview, isLoading, error };
};

export default useLinkPreview;
