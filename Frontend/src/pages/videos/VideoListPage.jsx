import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts/VideoContext';
import { useCategories } from '../../contexts/CategoryContext';
import VideoGrid from '../../components/videos/VideoGrid';
import VideoSearch from '../../components/videos/VideoSearch';
import Button from '../../components/common/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import Pagination from '../../components/common/Pagination';
import VideoGridSkeleton from '../../components/videos/VideoGridSkeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../contexts/AuthContext';

const VideoListPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { videos = [], totalVideos = 0, totalPages = 1, currentPage = 1, isLoadingVideos, isVideosError, availableTags = [], searchParams, handleSearch, handlePageChange } = useVideo();
  const { categories } = useCategories();

  const [localSearch, setLocalSearch] = useState({
    query: searchParams.query || '',
    tags: searchParams.tags || [],
    sort: searchParams.sort || 'newest',
    category: searchParams.category || '',
  });

  // Filter and sort videos
  const filteredVideos = videos.filter((video) => {
    if (localSearch.query) {
      const term = localSearch.query.toLowerCase();
      if (!video.title.toLowerCase().includes(term) && !video.description?.toLowerCase().includes(term) && !video.tags?.some((tag) => tag.toLowerCase().includes(term))) {
        return false;
      }
    }

    if (localSearch.category) {
      if (!video.category || video.category._id !== localSearch.category) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (localSearch.sort === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (localSearch.sort === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (localSearch.sort === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (localSearch.sort === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    handleSearch({
      ...localSearch,
      page: 1, // Reset to first page on new search
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalSearch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tag selection
  const handleTagToggle = (tag) => {
    setLocalSearch(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return {
        ...prev,
        tags: newTags
      };
    });
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setLocalSearch(prev => ({
      ...prev,
      category: e.target.value
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setLocalSearch({
      query: '',
      tags: [],
      sort: 'newest',
      category: '',
    });
    handleSearch({
      query: '',
      tags: [],
      sort: 'newest',
      category: '',
      page: 1,
    });
  };

  // Auto-submit when tags change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchSubmit();
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch.tags, localSearch.sort, localSearch.category]);

  // Loading state
  if (isLoadingVideos) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <VideoSearch
            searchParams={localSearch}
            availableTags={availableTags}
            categories={categories}
            onInputChange={handleInputChange}
            onTagToggle={handleTagToggle}
            onCategoryChange={handleCategoryChange}
            onClearFilters={handleClearFilters}
            onSubmit={handleSearchSubmit}
          />
        </div>
        <VideoGridSkeleton count={8} />
      </div>
    );
  }

  // Error state
  if (isVideosError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState 
          title="Error loading videos"
          message="There was an error loading the videos. Please try again later."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Empty state
  if (filteredVideos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <VideoSearch
            searchParams={localSearch}
            availableTags={availableTags}
            categories={categories}
            onInputChange={handleInputChange}
            onTagToggle={handleTagToggle}
            onCategoryChange={handleCategoryChange}
            onClearFilters={handleClearFilters}
            onSubmit={handleSearchSubmit}
          />
        </div>
        <EmptyState
          title="No videos found"
          message="Try adjusting your search or filters to find what you're looking for."
          action={
            isAuthenticated && (
              <Button 
                onClick={() => navigate('/videos/add')}
                className="mt-4"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Your First Video
              </Button>
            )
          }
        />
      </div>
    );
  }

  // Main content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Videos</h1>
        {isAuthenticated && (
          <Button onClick={() => navigate('/videos/add')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Video
          </Button>
        )}
      </div>

      <div className="mb-6">
        <VideoSearch
          searchParams={localSearch}
          availableTags={availableTags}
          categories={categories}
          onInputChange={handleInputChange}
          onTagToggle={handleTagToggle}
          onCategoryChange={handleCategoryChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleSearchSubmit}
        />
      </div>

      <VideoGrid videos={filteredVideos} />

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default VideoListPage;
