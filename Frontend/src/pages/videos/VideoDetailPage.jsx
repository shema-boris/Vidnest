import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts/VideoContext';
import VideoPlayer from '../../components/videos/VideoPlayer';
import Button from '../../components/common/Button';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const VideoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    getVideo,
    deleteVideo,
    handleViewIncrement,
    isUpdating,
    isDeleting: isDeletingContext,
  } = useVideo();
  
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const data = await getVideo(id);
        setVideo(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id, getVideo]);

  // Handle view increment when video is loaded
  useEffect(() => {
    if (video) {
      handleViewIncrement(video._id);
    }
  }, [video, handleViewIncrement]);

  // Handle delete video
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        await deleteVideo(id);
        toast.success('Video deleted successfully');
        navigate('/videos');
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error(error.response?.data?.message || 'Failed to delete video');
        setIsDeleting(false);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || 'Video not found'}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button
            onClick={() => navigate('/videos')}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Video Player */}
      <div className="bg-black rounded-lg overflow-hidden mb-8">
        <VideoPlayer
          src={video.url}
          poster={video.thumbnailUrl}
          autoPlay
          className="w-full h-auto"
        />
      </div>

      {/* Video Info */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
              {video.title}
            </h1>
            <div className="flex space-x-2">
              <Button
                as={Link}
                to={`/videos/${video._id}/edit`}
                variant="outline"
                className="flex items-center"
                disabled={isUpdating || isDeleting}
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                className="flex items-center"
                disabled={isDeleting || isDeletingContext}
                loading={isDeleting}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Uploaded on {format(new Date(video.createdAt), 'MMM d, yyyy')}</span>
            {video.views > 0 && (
              <span className="mx-2">•</span>
            )}
            {video.views > 0 && (
              <span>{video.views} views</span>
            )}
          </div>

          {video.description && (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {video.description}
              </p>
            </div>
          )}

          {video.tags && video.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;
