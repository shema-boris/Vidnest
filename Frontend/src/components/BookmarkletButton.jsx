import { useState } from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';

const BookmarkletButton = () => {
  const [copied, setCopied] = useState(false);

  // Get the current base URL (works for both local dev and production)
  const baseUrl = window.location.origin;
  
  // Bookmarklet code
  const bookmarkletCode = `javascript:(function(){window.open('${baseUrl}/share?url='+encodeURIComponent(window.location.href),'_blank','width=600,height=800');})();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookmarkIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Save Videos from Any Website
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag the button below to your bookmarks bar, then click it on any video page to instantly save to VidNest.
          </p>
          
          {/* Bookmarklet Button */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={bookmarkletCode}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-move shadow-md hover:shadow-lg"
              onClick={(e) => e.preventDefault()}
              draggable="true"
            >
              <BookmarkIcon className="w-4 h-4 mr-2" />
              📌 Save to VidNest
            </a>
            
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
          
          {/* Instructions */}
          <div className="mt-4 p-3 bg-white rounded border border-blue-100">
            <p className="text-xs text-gray-600 font-medium mb-2">📱 How to use:</p>
            <ol className="text-xs text-gray-600 space-y-1 ml-4 list-decimal">
              <li>Drag the "📌 Save to VidNest" button to your bookmarks bar</li>
              <li>Visit any video page (YouTube, TikTok, Vimeo, etc.)</li>
              <li>Click the bookmark to instantly save the video</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkletButton;
