
// src/pages/videos/VideoDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts/VideoContext';
import Button from '../../components/common/Button';
import { PencilIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { normalizeUrl } from '../../utils/normalizeUrl';

const VideoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const { getVideo, deleteVideo, incrementVideoViews } = useVideo();

  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch video
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const videoData = await getVideo(id);
        setVideo(videoData);

        if (isAuthenticated && user?._id !== videoData.user?._id) {
          await incrementVideoViews(id);
        }

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
  }, [id, isAuthenticated, user?._id, getVideo, incrementVideoViews]);

  // Delete handler
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        setIsDeleting(true);
        await deleteVideo(id);
        toast.success('Video deleted successfully');
        navigate('/videos');
      } catch (err) {
        console.error('Error deleting video:', err);
        toast.error('Failed to delete video');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div role="status" className="animate-pulse">
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
          <p className="text-sm text-red-700">{error}</p>
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

  const isOwner = user?._id === video.user?._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        {/* Thumbnail */}
        <div className="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center">
          <a
            href={normalizeUrl(video?.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <img
              src={video?.thumbnail || 'https://via.placeholder.com/640x360?text=Video'}
              alt={video?.title}
              className="w-full h-full object-cover"
            />
          </a>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {video.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <span>{video.views || 0} views</span>
                <span className="mx-2">•</span>
                <span>
                  {video.createdAt
                    ? new Date(video.createdAt).toLocaleDateString()
                    : ''}
                </span>
              </div>
            </div>

            {isOwner && (
              <div className="flex space-x-2">
                <Button
                  as={Link}
                  to={`/videos/edit/${video._id}`}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-line">
              {video.description}
            </p>
          </div>

          {/* Tags */}
          {video.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {video.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-900">Details</h3>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Duration</p>
                <p className="font-medium">
                  {video.duration
                    ? `${Math.floor(video.duration / 60)}:${(
                        video.duration % 60
                      )
                        .toString()
                        .padStart(2, '0')}`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Uploaded by</p>
                <p className="font-medium">{video.user?.name || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Watch Button */}
          <div className="mt-6">
            <a
              href={normalizeUrl(video?.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              ▶ Watch Video
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;
