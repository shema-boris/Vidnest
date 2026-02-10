import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      id,
      label,
      type = 'text',
      className = '',
      error,
      helpText,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm';
    const errorStyles = 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500';

    const classes = [
      baseStyles,
      error ? errorStyles : 'border-gray-300',
      className,
    ].join(' ');

    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          className={classes}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
        {helpText && !error && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
