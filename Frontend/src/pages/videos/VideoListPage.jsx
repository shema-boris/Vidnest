import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts/VideoContext';
import VideoGrid from '../../components/videos/VideoGrid';
import VideoSearch from '../../components/videos/VideoSearch';
import Button from '../../components/common/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import Pagination from '../../components/common/Pagination';
import VideoGridSkeleton from '../../components/videos/VideoGridSkeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const VideoListPage = () => {
  const navigate = useNavigate();
  const {
    videos = [],
    totalVideos = 0,
    totalPages = 1,
    currentPage = 1,
    isLoadingVideos,
    isVideosError,
    availableTags = [],
    searchParams,
    handleSearch,
    handlePageChange,
  } = useVideo();

  const [localSearch, setLocalSearch] = useState({
    query: searchParams.query || '',
    tags: searchParams.tags || [],
    sort: searchParams.sort || 'newest',
  });

  // Sync local state with URL params
  useEffect(() => {
    setLocalSearch({
      query: searchParams.query || '',
      tags: searchParams.tags || [],
      sort: searchParams.sort || 'newest',
    });
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    handleSearch({
      query: localSearch.query,
      tags: localSearch.tags,
      sort: localSearch.sort,
    });
  };

  const handleClearFilters = () => {
    const newParams = { query: '', tags: [], sort: 'newest' };
    setLocalSearch(newParams);
    handleSearch(newParams);
  };

  const onPageChange = (page) => {
    handlePageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (isLoadingVideos) {
      return <VideoGridSkeleton count={12} />;
    }

    if (isVideosError) {
      return <ErrorState message="Failed to load videos. Please try again later." />;
    }

    if (!videos || videos.length === 0) {
      return (
        <EmptyState 
          title="No Videos Found" 
          message="Try adjusting your search filters or add your first video!"
          action={
            <Button onClick={() => navigate('/videos/add')}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First Video
            </Button>
          }
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalVideos} {totalVideos === 1 ? 'video' : 'videos'} found
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => navigate('/videos/add')}
            variant="primary"
            className="w-full md:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Video
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <VideoSearch
          query={localSearch.query}
          tags={localSearch.tags}
          sort={localSearch.sort}
          availableTags={availableTags}
          onQueryChange={(value) => setLocalSearch(prev => ({ ...prev, query: value }))} 

          onTagsChange={(tags) => setLocalSearch(prev => ({ ...prev, tags }))}
          onSortChange={(sort) => setLocalSearch(prev => ({ ...prev, sort }))}
          onSubmit={handleSearchSubmit}
          onClear={handleClearFilters}
        />
      </div>

      {renderContent()}
    </div>
  );
};

export default VideoListPage;
