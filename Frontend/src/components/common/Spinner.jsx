import { classNames } from '../../utils/classNames';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3 border-2',
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-4'
  };

  return (
    <div 
      className={classNames(
        'animate-spin rounded-full border-solid border-gray-300 border-t-blue-500',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
