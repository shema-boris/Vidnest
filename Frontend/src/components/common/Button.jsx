import { forwardRef } from 'react';

const Button = forwardRef(
  ({
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    disabled = false,
    children,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';

    const variantStyles = {
      primary: 'bg-primary text-primary-foreground border-transparent hover:bg-primary/90 focus:ring-primary',
      secondary: 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/90 focus:ring-secondary',
      outline: 'bg-transparent text-foreground border-input hover:bg-accent hover:text-accent-foreground focus:ring-ring',
      danger: 'bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/90 focus:ring-destructive',
      ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground border-transparent focus:ring-ring',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    const disabledStyles = 'opacity-50 cursor-not-allowed';

    const classes = [
      'button',
      baseStyles,
      variantStyles[variant] || variantStyles.primary,
      sizeStyles[size] || sizeStyles.md,
      (disabled || loading) ? disabledStyles : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <Component
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
