import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { RssIcon } from '@heroicons/react/24/solid';
import api from '../utils/api';
import VideoCard from '../components/videos/VideoCard';

const Feed = () => {
  const [feedData, setFeedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/feed/latest');
      setFeedData(response.data);
      
      // Auto-expand all categories by default
      const initialExpanded = {};
      Object.keys(response.data).forEach(category => {
        initialExpanded[category] = true;
      });
      setExpandedCategories(initialExpanded);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError(err.response?.data?.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const getCategoryEmoji = (categoryName) => {
    const emojiMap = {
      'Tech': '💻',
      'Technology': '💻',
      'Music': '🎵',
      'Lifestyle': '🌟',
      'Gaming': '🎮',
      'Education': '📚',
      'Entertainment': '🎬',
      'Sports': '⚽',
      'News': '📰',
      'Cooking': '🍳',
      'Travel': '✈️',
      'Fashion': '👗',
      'Fitness': '💪',
      'Art': '🎨',
      'Science': '🔬',
      'Business': '💼',
      'Health': '🏥',
      'DIY': '🔨',
      'Pets': '🐾',
      'Comedy': '😂'
    };
    return emojiMap[categoryName] || '📁';
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading your feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Failed to Load Feed</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchFeed}
            className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const categories = Object.keys(feedData);
  const hasVideos = categories.some(cat => feedData[cat].length > 0);

  if (!hasVideos) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <RssIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No Videos Yet</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Start adding videos to see them organized in your feed by category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Latest Feed</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your saved videos organized by category, newest first
        </p>
      </div>

      {/* Feed Content */}
      <div className="space-y-8">
        {categories.map(categoryName => {
          const videos = feedData[categoryName];
          if (videos.length === 0) return null;

          const isExpanded = expandedCategories[categoryName];

          return (
            <div key={categoryName} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryName)}
                className="flex w-full items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryEmoji(categoryName)}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {categoryName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {videos.length} {videos.length === 1 ? 'video' : 'videos'}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {/* Videos Grid */}
              {isExpanded && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {videos.map(video => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
