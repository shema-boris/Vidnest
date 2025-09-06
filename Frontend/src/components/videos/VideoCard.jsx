import { EyeIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { getPlatformIcon } from '../../utils/platformUtils';
import RichLinkPreview from '../common/RichLinkPreview';

const VideoCard = ({ video }) => {
  if (!video) return null;

  const {
    title,
    thumbnail,
    duration,
    views = 0,
    platform,
    tags = [],
    createdAt,
    isPublic = true,
    url,
  } = video;

  // Format duration in seconds to MM:SS
  const formatDuration = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format view count
  const formatViews = (count) => {
    if (isNaN(count) || count === null) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  // Format date to relative time (e.g., "2 days ago")
  const timeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }

    return 'Just now';
  };

  const PlatformIcon = getPlatformIcon(platform);

  if (url) {
    return <RichLinkPreview url={url} className="w-full" />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:bg-gray-800"
    >
      <div className="relative aspect-video overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
            <ArrowTopRightOnSquareIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {!isPublic && (
          <div className="absolute right-2 top-2 rounded bg-black bg-opacity-70 px-2 py-1 text-xs font-medium text-white">
            Private
          </div>
        )}

        {duration && (
          <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-70 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(duration)}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <span className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </span>

          {PlatformIcon && (
            <div className="ml-2 flex-shrink-0">
              <PlatformIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <EyeIcon className="mr-1 h-3.5 w-3.5" />
            <span>{formatViews(views)}</span>
          </div>

          <div className="flex items-center">
            <ClockIcon className="mr-1 h-3.5 w-3.5" />
            <span>{timeAgo(createdAt)}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
};

export default VideoCard;
