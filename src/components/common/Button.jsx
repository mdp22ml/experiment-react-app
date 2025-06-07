import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component for use throughout the application
 */
const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) => {
  
  // Base styles for all buttons
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors";
  
  // Variant specific styles
  const variantStyles = {
    primary: "border-transparent text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300",
  };

  // Get the appropriate variant styles (default to primary if invalid variant)
  const buttonVariantStyles = variantStyles[variant] || variantStyles.primary;
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${buttonVariantStyles} ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default Button;