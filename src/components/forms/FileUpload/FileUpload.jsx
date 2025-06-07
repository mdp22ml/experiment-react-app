import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

/**
 * File upload component with drag and drop functionality
 */
const FileUpload = ({ onFilesSelected, selectedFiles = [], error = null }) => {
  // Maximum file size in bytes (50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  
  // Accepted file types
  const ACCEPTED_FILE_TYPES = {
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
    'application/json': ['.json'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
  };
  
  // Handle files drop
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Process accepted files
    const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    
    // Display warnings for rejected files if needed
    if (rejectedFiles.length > 0 || acceptedFiles.length > validFiles.length) {
      console.warn('Some files were rejected:', rejectedFiles);
      // Here we could show user feedback about rejected files
    }
    
    // Call the parent component's callback with the valid files
    onFilesSelected(validFiles);
  }, [onFilesSelected, MAX_FILE_SIZE]);
  
  // Setup react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE
  });
  
  // Remove a file from the selected files
  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    onFilesSelected(updatedFiles);
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Data Files*
      </label>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition duration-150 ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg 
            className={`mx-auto h-12 w-12 ${isDragActive ? 'text-blue-500' : error ? 'text-red-500' : 'text-gray-400'}`}
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Drop files here or click to upload</span>
          </div>
          <p className="text-xs text-gray-500">
            CSV, Excel, TXT, JSON, PNG or JPG (max 50MB per file)
          </p>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-200 border border-gray-200 rounded-md">
          {selectedFiles.map((file, index) => (
            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
              <div className="flex items-center flex-1 min-w-0">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 flex-1 w-0 truncate">
                  {file.name}
                </span>
                <span className="ml-2 flex-shrink-0 text-gray-400">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  className="font-medium text-red-600 hover:text-red-500"
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  onFilesSelected: PropTypes.func.isRequired,
  selectedFiles: PropTypes.array,
  error: PropTypes.string
};

export default FileUpload;