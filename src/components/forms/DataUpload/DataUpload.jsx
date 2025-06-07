import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiUpload, FiFile, FiTrash2, FiDownload } from 'react-icons/fi';

/**
 * DataUpload Component
 * Allows users to upload experiment data files with drag-and-drop support
 */
const DataUpload = ({ 
  onDataUploaded, 
  protocol, 
  acceptedFileTypes = ['.csv', '.xlsx', '.json', '.txt'],
  maxFileSize = 10 // in MB
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [templates, setTemplates] = useState([
    { name: 'CSV Template', type: 'csv', url: '/data_collection_template.csv' },
    { name: 'Excel Template', type: 'xlsx', url: '/data_collection_template.xlsx' }
  ]);

  // Handle files being dropped
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle file input change
  const handleChange = useCallback((e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, []);

  // Process the files
  const handleFiles = useCallback((fileList) => {
    setError('');
    const newFiles = [];
    const fileErrors = [];
    
    // Check file types and sizes
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = `.${file.name.split('.').pop().toLowerCase()}`;
      
      // Check file type
      if (!acceptedFileTypes.includes(extension)) {
        fileErrors.push(`${file.name}: File type not accepted. Please upload ${acceptedFileTypes.join(', ')} files.`);
        continue;
      }
      
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        fileErrors.push(`${file.name}: File exceeds the ${maxFileSize}MB size limit.`);
        continue;
      }
      
      // Check if file already exists
      const exists = files.some(existingFile => existingFile.name === file.name);
      if (exists) {
        fileErrors.push(`${file.name}: A file with this name has already been uploaded.`);
        continue;
      }
      
      newFiles.push(file);
    }
    
    if (fileErrors.length > 0) {
      setError(fileErrors.join('\n'));
    }
    
    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onDataUploaded(updatedFiles);
      setSuccess(`Successfully uploaded ${newFiles.length} file${newFiles.length !== 1 ? 's' : ''}.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  }, [files, acceptedFileTypes, maxFileSize, onDataUploaded]);

  // Remove a file
  const removeFile = useCallback((filename) => {
    const updatedFiles = files.filter(file => file.name !== filename);
    setFiles(updatedFiles);
    onDataUploaded(updatedFiles);
  }, [files, onDataUploaded]);

  // Download a template
  const downloadTemplate = useCallback((templateUrl) => {
    window.open(templateUrl, '_blank');
  }, []);

  useEffect(() => {
    // If protocol changes, generate appropriate templates
    if (protocol) {
      // In a real implementation, we would generate custom templates
      // based on the protocol details
      console.log('Protocol updated, templates would be customized', protocol.title);
    }
  }, [protocol]);

  return (
    <div className="data-upload-container space-y-6">
      {/* File upload area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <FiUpload className="w-10 h-10 text-gray-400" />
          <div className="text-gray-700">
            <p className="font-medium">Drag and drop your data files here</p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: {acceptedFileTypes.join(', ')}
            </p>
          </div>
          <div>
            <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Browse Files
              <input
                type="file"
                className="hidden"
                onChange={handleChange}
                multiple
                accept={acceptedFileTypes.join(',')}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Templates section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Download Templates</h3>
        <p className="text-sm text-gray-600 mb-4">
          Use these templates to format your data correctly for this experiment.
        </p>
        <div className="flex flex-wrap gap-3">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => downloadTemplate(template.url)}
              className="flex items-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
            >
              <FiDownload />
              <span>{template.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p className="font-medium">Error uploading files:</p>
          <pre className="whitespace-pre-wrap text-sm mt-1">{error}</pre>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md">
          <p>{success}</p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Uploaded Files</h3>
          <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow overflow-hidden">
            {files.map((file, index) => (
              <li key={index} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FiFile className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {file.type || 'unknown type'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(file.name)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                  aria-label="Remove file"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

DataUpload.propTypes = {
  onDataUploaded: PropTypes.func.isRequired,
  protocol: PropTypes.object,
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
  maxFileSize: PropTypes.number
};

export default DataUpload;