import { forwardRef } from 'react';

const Textarea = forwardRef(
  (
    {
      id,
      label,
      className = '',
      error,
      helpText,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm';
    const errorStyles = 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500';

    const classes = [
      baseStyles,
      error ? errorStyles : 'border-gray-300',
      className,
    ].join(' ');

    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={classes}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
        {helpText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
