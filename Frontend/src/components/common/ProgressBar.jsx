const ProgressBar = ({ value = 0, className = '' }) => {
    const progress = Math.min(100, Math.max(0, value));
  
    return (
      <div
        className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}
      >
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };
  
  export default ProgressBar;
  