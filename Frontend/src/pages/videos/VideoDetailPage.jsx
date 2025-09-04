import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts/VideoContext';
import VideoPlayer from '../../components/videos/VideoPlayer';
import Button from '../../components/common/Button';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const VideoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    getVideo,
    deleteVideo,
    incrementVideoViews,
    isUpdating,
    isDeleting: isDeletingContext,
  } = useVideo();
  
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const videoData = await getVideo(id);
        setVideo(videoData);
        
        // Increment view count
        if (isAuthenticated) {
          await incrementVideoViews(id);
        }
        
        // Fetch related videos (you'll need to implement this in your API)
        // const related = await getRelatedVideos(id, videoData.tags);
        // setRelatedVideos(related);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video. Please try again later.');
        toast.error('Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id, isAuthenticated]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        setIsDeleting(true);
        await deleteVideo(id);
        toast.success('Video deleted successfully');
        navigate('/videos');
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Failed to delete video');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-6"></div>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
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
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Video not found</p>
        <Button onClick={() => navigate('/videos')} className="mt-4">
          Back to Videos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Videos
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Video Player */}
        <div className="aspect-w-16 aspect-h-9 bg-black">
          <VideoPlayer
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            autoPlay
            className="w-full h-full"
          />
        </div>

        {/* Video Info */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{video.views} views</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(video.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>

            {isAuthenticated && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => navigate(`/videos/${video._id}/edit`)}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  size="sm"
                  className="flex items-center"
                  disabled={isDeleting || isDeletingContext}
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  {isDeleting || isDeletingContext ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            )}
          </div>

          {/* Video Description */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
              {video.description || 'No description provided.'}
            </p>
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedVideos.map((relatedVideo) => (
              <div key={relatedVideo._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={relatedVideo.thumbnailUrl}
                    alt={relatedVideo.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {relatedVideo.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {relatedVideo.views} views • {format(new Date(relatedVideo.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetailPage;
