import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loader component to show loading states
 */
const Loader = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  // Size variants for spinner
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-10 w-10'
  };
  
  // Text size variants
  const textClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg 
        className={`animate-spin text-blue-600 ${sizeClasses[size] || sizeClasses.medium}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && (
        <span className={`mt-2 text-gray-700 ${textClasses[size] || textClasses.medium}`}>
          {text}
        </span>
      )}
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string,
  className: PropTypes.string
};

export default Loader;