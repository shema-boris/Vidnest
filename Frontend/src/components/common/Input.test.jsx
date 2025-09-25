import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Input from './Input';

describe('Input component', () => {
  it('renders correctly with a label', () => {
    render(<Input id="username" label="Username" />);
    const inputElement = screen.getByLabelText(/username/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('updates its value on user input', () => {
    render(<Input id="test-input" label="Test Input" />);
    const inputElement = screen.getByLabelText(/test input/i);
    fireEvent.change(inputElement, { target: { value: 'hello world' } });
    expect(inputElement.value).toBe('hello world');
  });

  it('displays an error message when the error prop is provided', () => {
    const error = { message: 'This field is required' };
    render(<Input id="error-input" label="Error Input" error={error} />);
    const errorMessage = screen.getByText(/this field is required/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('displays help text when provided and there is no error', () => {
    render(<Input id="help-input" label="Help Input" helpText="Some helpful text" />);
    const helpText = screen.getByText(/some helpful text/i);
    expect(helpText).toBeInTheDocument();
  });

  it('does not display help text when there is an error', () => {
    const error = { message: 'An error occurred' };
    render(<Input id="help-error-input" label="Help Error Input" helpText="This should not show" error={error} />);
    const helpText = screen.queryByText(/this should not show/i);
    expect(helpText).not.toBeInTheDocument();
  });

  it('forwards the ref to the input element', () => {
    const ref = { current: null };
    render(<Input id="ref-input" label="Ref Input" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
