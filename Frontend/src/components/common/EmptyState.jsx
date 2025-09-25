import { VideoCameraIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ 
  icon: Icon = VideoCameraIcon,
  title = 'No items found',
  message = 'There are no items to display at this time.'
}) => (
  <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm">
    <Icon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
  </div>
);

export default EmptyState;
