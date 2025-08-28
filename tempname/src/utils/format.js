/**
 * Format a date string to a more readable format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string (e.g., "Jan 1, 2023")
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a number of views into a more readable string
 * @param {number} views - The number of views
 * @returns {string} Formatted views string (e.g., "1.2K", "5M")
 */
export const formatViews = (views) => {
  if (!views && views !== 0) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

/**
 * Format a duration in seconds into a time string (MM:SS)
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted time string (e.g., "02:30")
 */
export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds === Infinity) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
