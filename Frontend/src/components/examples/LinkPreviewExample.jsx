import { useState } from 'react';
import LinkPreview from '../common/LinkPreview';

const LinkPreviewExample = () => {
  const [inputValue, setInputValue] = useState('');
  const [urls, setUrls] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Extract URLs from the input
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const extractedUrls = inputValue.match(urlRegex) || [];
    
    if (extractedUrls.length > 0) {
      setUrls(prev => [...new Set([...prev, ...extractedUrls])]);
      setInputValue('');
    }
  };

  const handleClear = () => {
    setUrls([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Link Preview Example</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste a URL (e.g., https://example.com)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Paste a URL and press Enter or click Add to see a preview
        </p>
      </form>

      {urls.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Link Previews</h3>
            <button
              onClick={handleClear}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear all
            </button>
          </div>
          
          <div className="space-y-4">
            {urls.map((url, index) => (
              <LinkPreview key={index} url={url} className="max-w-2xl" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkPreviewExample;
