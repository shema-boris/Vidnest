import { forwardRef, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const FileInput = forwardRef(
  (
    {
      id,
      label,
      className = '',
      error,
      helpText,
      onChange,
      ...props
    },
    ref
  ) => {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName('');
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={id}
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload a file</span>
                <input
                  id={id}
                  ref={ref}
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  {...props}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            {fileName && (
              <p className="text-sm text-gray-500">Selected file: {fileName}</p>
            )}
          </div>
        </div>
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

FileInput.displayName = 'FileInput';

export default FileInput;
