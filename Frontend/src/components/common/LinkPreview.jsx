import { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from './Spinner';
import { ExternalLinkIcon } from '@heroicons/react/outline';

const LinkPreview = ({ url, className = '' }) => {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url) return;
      
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
        setError('Could not load preview');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent too many requests while typing
    const timer = setTimeout(() => {
      fetchPreview();
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  if (isLoading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <Spinner size="sm" />
          <span className="text-sm text-gray-500">Loading preview...</span>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    return null; // Don't render anything if there's an error or no preview
  }

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
      {preview.image && (
        <div className="h-40 bg-gray-100 overflow-hidden">
          <img
            src={preview.image}
            alt={preview.title || 'Link preview'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start space-x-2">
          {preview.favicon && (
            <img
              src={preview.favicon}
              alt=""
              className="w-4 h-4 mt-1 flex-shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {preview.title || preview.url}
            </h3>
            {preview.siteName && (
              <p className="text-xs text-gray-500 mt-1">{preview.siteName}</p>
            )}
            {preview.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {preview.description}
              </p>
            )}
          </div>
          <ExternalLinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
