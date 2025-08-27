import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from './ProgressBar';

describe('ProgressBar component', () => {
  it('renders correctly', () => {
    render(<ProgressBar />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('displays the correct progress percentage', () => {
    render(<ProgressBar value={50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 50%');
  });

  it('clamps the progress value to a maximum of 100', () => {
    render(<ProgressBar value={150} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 100%');
  });

  it('clamps the progress value to a minimum of 0', () => {
    render(<ProgressBar value={-50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 0%');
  });

  it('applies additional class names', () => {
    render(<ProgressBar className="my-custom-class" />);
    // The progress bar is composed of two divs, we check the outer one
    const outerDiv = screen.getByRole('progressbar').parentElement;
    expect(outerDiv).toHaveClass('my-custom-class');
  });
});
