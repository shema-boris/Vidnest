import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FileInput from './FileInput';

describe('FileInput component', () => {
  it('renders correctly with a label', () => {
    render(<FileInput id="video-upload" label="Upload Video" />);
    expect(screen.getByLabelText(/upload video/i)).toBeInTheDocument();
  });

  it('triggers onChange and displays the file name when a file is selected', () => {
    const handleChange = vi.fn();
    render(<FileInput id="file-input" label="File Input" onChange={handleChange} />);
    
    const file = new File(['(⌐□_□)'], 'cool_video.mp4', { type: 'video/mp4' });
    const inputElement = screen.getByLabelText(/upload a file/i);

    fireEvent.change(inputElement, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Selected file: cool_video.mp4')).toBeInTheDocument();
  });

  it('displays an error message when the error prop is provided', () => {
    const error = { message: 'File is too large' };
    render(<FileInput id="error-file-input" label="Error File Input" error={error} />);
    expect(screen.getByText(/file is too large/i)).toBeInTheDocument();
  });
});
