import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiDownload } from 'react-icons/fi';
import Button from '../components/common/Button';
import DataUpload from '../components/forms/DataUpload/DataUpload';
import { useExperiment } from '../contexts/ExperimentContext';
import protocolService from '../services/protocolService';

/**
 * DataCollection Page
 * Allows users to upload experiment data files after protocol generation
 */
const DataCollection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { experiment, protocol, updateExperimentData } = useExperiment();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [dataTemplateGenerated, setDataTemplateGenerated] = useState(false);

  // Effect to check if we have a protocol
  useEffect(() => {
    if (!protocol) {
      // If no protocol exists, redirect to protocol generation page
      setMessage('No protocol found. Please generate a protocol first.');
      setTimeout(() => {
        navigate('/protocol/generate');
      }, 3000);
    }
  }, [protocol, navigate]);

  // Handle data files being uploaded
  const handleDataUploaded = (files) => {
    setUploadedFiles(files);
    
    // Update experiment data with uploaded file information
    updateExperimentData({
      ...experiment,
      dataFiles: files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }))
    });
  };

  // Handle generating data collection template
  const handleGenerateTemplate = async () => {
    if (!protocol) return;
    
    try {
      setMessage('Generating data collection template...');
      
      // Generate template based on the protocol
      const template = protocolService.generateDataTemplate(protocol);
      console.log('Generated data template:', template);
      
      setDataTemplateGenerated(true);
      setMessage('Template generated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error generating template:', error);
      setMessage('Failed to generate template. Please try again.');
    }
  };

  // Go back to protocol generation
  const handleBackToProtocol = () => {
    navigate('/protocol/generate');
  };

  // Continue to data analysis
  const handleContinueToAnalysis = () => {
    navigate('/data/analysis', { state: { uploadedFiles } });
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Collection</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload your experiment data files for analysis
        </p>
      </div>
      
      {/* Message display */}
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
        }`}>
          {message}
        </div>
      )}
      
      {protocol && (
        <div className="space-y-8">
          {/* Protocol summary */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Protocol Summary</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{protocol.title}</p>
              </div>
              <Button 
                type="button"
                variant="outline"
                onClick={handleBackToProtocol}
                className="flex items-center gap-2"
              >
                <FiArrowLeft /> Back to Protocol
              </Button>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="text-sm text-gray-500">
                <p className="mb-2">Generated on: {protocol.date}</p>
                <p>To collect data for this experiment, upload your files below or generate a data collection template.</p>
              </div>
            </div>
          </div>
          
          {/* Template Generation */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Data Collection Templates</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Generate templates based on your protocol for structured data collection
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6 flex items-center gap-4">
              <Button
                type="button"
                onClick={handleGenerateTemplate}
                disabled={dataTemplateGenerated}
                className="flex items-center gap-2"
              >
                {dataTemplateGenerated ? <FiCheck /> : <FiDownload />}
                {dataTemplateGenerated ? 'Template Generated' : 'Generate Template'}
              </Button>
              
              {dataTemplateGenerated && (
                <div className="text-sm text-gray-500">
                  Data collection template has been generated based on your protocol.
                </div>
              )}
            </div>
          </div>
          
          {/* Data Upload */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Experiment Data</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Upload your experimental data files for analysis
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <DataUpload 
                onDataUploaded={handleDataUploaded}
                protocol={protocol}
                acceptedFileTypes={['.csv', '.xlsx', '.json', '.txt']}
                maxFileSize={20}
              />
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToProtocol}
              className="flex items-center gap-2"
            >
              <FiArrowLeft /> Back to Protocol
            </Button>
            
            <Button
              type="button"
              onClick={handleContinueToAnalysis}
              disabled={uploadedFiles.length === 0}
              className="flex items-center gap-2"
            >
              Continue to Analysis <FiArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCollection;