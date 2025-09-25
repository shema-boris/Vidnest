import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const RichLinkPreview = ({ url, className = '' }) => {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/preview?url=${encodeURIComponent(url)}`);
        setPreview(response.data);
      } catch (err) {
        console.error('Error fetching link preview:', err);
        setError('Could not load preview');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm ${className}`}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 text-blue-600 hover:underline break-all"
        >
          {url}
        </a>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <a
        href={preview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* Image */}
        {preview.image && (
          <div className="relative aspect-video bg-gray-100">
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

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-2">
            {preview.title || preview.url}
          </h3>

          {/* Description */}
          {preview.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {preview.description}
            </p>
          )}

          {/* URL and favicon */}
          <div className="flex items-center mt-2">
            {preview.favicon && (
              <img
                src={preview.favicon}
                alt=""
                className="h-3 w-3 mr-1.5"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <span className="text-xs text-gray-500 truncate">
              {new URL(preview.url).hostname.replace('www.', '')}
            </span>
            <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1.5 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default RichLinkPreview;
