import { useEffect, useState } from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ 
  videos = [], 
  isLoading = false, 
  error = null,
  onEndReached,
  hasMore = false,
  loadingComponent = <div>Loading...</div>,
  emptyComponent = <div>No videos found</div>,
  errorComponent = <div>Error loading videos</div>,
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5
  },
  gap = 4,
  className = ''
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Handle infinite scroll
  useEffect(() => {
    if (!onEndReached || !hasMore || isLoading || isLoadingMore) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 100;
      
      if (scrolledToBottom) {
        setIsLoadingMore(true);
        Promise.resolve(onEndReached())
          .finally(() => setIsLoadingMore(false));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onEndReached, hasMore, isLoading, isLoadingMore]);

  // Handle loading state
  if (isLoading && videos.length === 0) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-${columns['2xl']} gap-${gap} ${className}`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-8">
        {errorComponent}
      </div>
    );
  }

  // Handle empty state
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyComponent}
      </div>
    );
  }

  // Generate responsive grid class names
  const gridClassNames = [
    'grid',
    `grid-cols-${columns.sm || 1}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    columns['2xl'] && `2xl:grid-cols-${columns['2xl']}`,
    `gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-6">
      <div className={gridClassNames}>
        {videos.map((video) => (
          <VideoCard 
            key={video._id || video.id} 
            video={video} 
          />
        ))}
      </div>
      
      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* End of results */}
      {!hasMore && videos.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          No more videos to show
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
