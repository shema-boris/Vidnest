import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Textarea from './Textarea';

describe('Textarea component', () => {
  it('renders correctly with a label', () => {
    render(<Textarea id="description" label="Description" />);
    const textareaElement = screen.getByLabelText(/description/i);
    expect(textareaElement).toBeInTheDocument();
  });

  it('updates its value on user input', () => {
    render(<Textarea id="test-textarea" label="Test Textarea" />);
    const textareaElement = screen.getByLabelText(/test textarea/i);
    fireEvent.change(textareaElement, { target: { value: 'some text' } });
    expect(textareaElement.value).toBe('some text');
  });

  it('displays an error message when the error prop is provided', () => {
    const error = { message: 'Cannot be empty' };
    render(<Textarea id="error-textarea" label="Error Textarea" error={error} />);
    const errorMessage = screen.getByText(/cannot be empty/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('displays help text when provided and there is no error', () => {
    render(<Textarea id="help-textarea" label="Help Textarea" helpText="Provide additional details" />);
    const helpText = screen.getByText(/provide additional details/i);
    expect(helpText).toBeInTheDocument();
  });

  it('does not display help text when there is an error', () => {
    const error = { message: 'An error occurred' };
    render(<Textarea id="help-error-textarea" label="Help Error Textarea" helpText="This should not be visible" error={error} />);
    const helpText = screen.queryByText(/this should not be visible/i);
    expect(helpText).not.toBeInTheDocument();
  });

  it('forwards the ref to the textarea element', () => {
    const ref = { current: null };
    render(<Textarea id="ref-textarea" label="Ref Textarea" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
