import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../../components/common/Button';
import FileUpload from '../FileUpload/FileUpload';
import AnalysisSelection from '../AnalysisSelection/AnalysisSelection';
import VisualizationSelection from '../VisualizationSelection/VisualizationSelection';
import { useExperiment } from '../../../contexts/ExperimentContext';

/**
 * Main experiment creation form component
 */
const ExperimentForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateExperiment, protocol } = useExperiment();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    designRationale: '',
    files: [],
    analysisTypes: [],
    visualizationTypes: [],
    outputFormat: ['pdf'],
    additionalOutputs: []
  });
  
  // Current step in the multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Check for protocol from navigation state
  useEffect(() => {
    if (location.state?.protocol) {
      // Update title and purpose from protocol if available
      setFormData(prev => ({
        ...prev,
        title: location.state.protocol.title || prev.title,
        purpose: location.state.protocol.sections.find(s => s.id === 'introduction')?.content || prev.purpose
      }));
    }
  }, [location.state]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle files selection
  const handleFilesChange = (files) => {
    setFormData(prevData => ({
      ...prevData,
      files
    }));
    
    // Clear error for files if it exists
    if (errors.files) {
      setErrors(prev => ({ ...prev, files: null }));
    }
  };
  
  // Handle analysis types selection
  const handleAnalysisChange = (selectedAnalysis) => {
    setFormData(prevData => ({
      ...prevData,
      analysisTypes: selectedAnalysis
    }));
    
    // Clear error for analysis if it exists
    if (errors.analysisTypes) {
      setErrors(prev => ({ ...prev, analysisTypes: null }));
    }
  };
  
  // Handle visualization types selection
  const handleVisualizationChange = (selectedVisualizations) => {
    setFormData(prevData => ({
      ...prevData,
      visualizationTypes: selectedVisualizations
    }));
    
    // Clear error for visualizations if it exists
    if (errors.visualizationTypes) {
      setErrors(prev => ({ ...prev, visualizationTypes: null }));
    }
  };
  
  // Handle output format selection
  const handleOutputFormatChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => {
      if (checked) {
        return {
          ...prevData,
          outputFormat: [...prevData.outputFormat, value]
        };
      } else {
        return {
          ...prevData,
          outputFormat: prevData.outputFormat.filter(format => format !== value)
        };
      }
    });
  };
  
  // Validate the current step
  const validateStep = () => {
    const stepErrors = {};
    
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        stepErrors.title = 'Title is required';
      }
    }
    
    if (currentStep === 2) {
      // Protocol generation step
      if (!protocol) {
        stepErrors.protocol = 'You must generate a protocol before proceeding';
      }
    }
    
    if (currentStep === 3) {
      // Data upload step
      if (formData.files.length === 0) {
        stepErrors.files = 'At least one file is required';
      }
    }
    
    if (currentStep === 4) {
      // Analysis selection step
      if (formData.analysisTypes.length === 0) {
        stepErrors.analysisTypes = 'At least one analysis type is required';
      }
      
      if (formData.visualizationTypes.length === 0) {
        stepErrors.visualizationTypes = 'At least one visualization type is required';
      }
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };
  
  // Move to the next step
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };
  
  // Move to the previous step
  const handlePreviousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };
  
  // Generate protocol based on current experiment data
  const handleGenerateProtocol = () => {
    // Make sure we have at least a title
    if (!formData.title.trim()) {
      setErrors(prev => ({ ...prev, title: 'Title is required to generate a protocol' }));
      return;
    }
    
    // Update experiment context with current form data
    updateExperiment(formData);
    
    // Navigate to protocol generation page with experiment data
    navigate('/protocol/generate', { state: { experimentData: formData } });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      // Update experiment context with form data
      updateExperiment(formData);
      
      // Call the submit callback
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg">
      {/* Form Header */}
      <div className="border-b border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900">
          {currentStep === 1 && 'Experiment Details'}
          {currentStep === 2 && 'Protocol Generation'}
          {currentStep === 3 && 'Data Upload'}
          {currentStep === 4 && 'Analysis & Visualization Selection'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {currentStep === 1 && 'Provide basic information about your experiment'}
          {currentStep === 2 && 'Generate and review your experiment protocol'}
          {currentStep === 3 && 'Upload your experimental data files'}
          {currentStep === 4 && 'Choose how you want your data to be analyzed and visualized'}
        </p>
      </div>
      
      <div className="p-6">
        {/* Step 1: Basic Experiment Info */}
        {currentStep === 1 && (
          <>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Experiment Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full rounded-md border ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2 px-3`}
                placeholder="Enter a descriptive title for your experiment"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Experiment Purpose
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                placeholder="Describe the purpose of your experiment"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="designRationale" className="block text-sm font-medium text-gray-700 mb-1">
                Design Rationale
              </label>
              <textarea
                id="designRationale"
                name="designRationale"
                value={formData.designRationale}
                onChange={handleChange}
                rows={3}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                placeholder="Explain the rationale behind your experiment design"
              />
            </div>
          </>
        )}
        
        {/* Step 2: Protocol Generation */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Generate a protocol before proceeding to data upload.
                  </p>
                </div>
              </div>
            </div>

            {protocol ? (
              <>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Protocol has been generated successfully! You can now proceed with data upload.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-md p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Protocol Summary</h4>
                  <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Title:</span> {protocol.title}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">Sections:</span> {protocol.sections?.length || 0}</p>
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/protocol/generate', { state: { viewOnly: true } })}
                    >
                      View Full Protocol
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-gray-600 mb-4">No protocol generated yet</p>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleGenerateProtocol}
                >
                  Generate Protocol Now
                </Button>
                {errors.protocol && (
                  <p className="mt-2 text-sm text-red-600">{errors.protocol}</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Step 3: Data Upload */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-4">Upload your experimental data files. You can also download a template for data collection.</p>
              
              <div className="flex justify-start mb-6">
                <button
                  type="button"
                  className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 inline-flex items-center mr-2"
                  onClick={() => {
                    // Download CSV template for data collection
                    const a = document.createElement('a');
                    a.href = '/data_collection_template.csv';
                    a.download = `${formData.title || 'experiment'}_data_template.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download Data Template
                </button>
              </div>
              
              <FileUpload 
                onFilesSelected={handleFilesChange}
                selectedFiles={formData.files}
                error={errors.files}
              />
            </div>
          </div>
        )}

        {/* Step 4: Analysis & Visualization Selection */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="mb-6">
              <AnalysisSelection 
                selectedAnalysisTypes={formData.analysisTypes}
                onChange={handleAnalysisChange}
                error={errors.analysisTypes}
              />
            </div>
            
            <div className="mb-6">
              <VisualizationSelection 
                selectedVisualizationTypes={formData.visualizationTypes}
                onChange={handleVisualizationChange}
                error={errors.visualizationTypes}
              />
            </div>
            
            <div className="mb-6">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Output Formats
                </legend>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="pdf"
                      name="outputFormat"
                      type="checkbox"
                      value="pdf"
                      checked={formData.outputFormat.includes('pdf')}
                      onChange={handleOutputFormatChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="pdf" className="ml-3 text-sm text-gray-700">PDF Report</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="ppt"
                      name="outputFormat"
                      type="checkbox"
                      value="ppt"
                      checked={formData.outputFormat.includes('ppt')}
                      onChange={handleOutputFormatChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="ppt" className="ml-3 text-sm text-gray-700">PowerPoint Presentation</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="word"
                      name="outputFormat"
                      type="checkbox"
                      value="word"
                      checked={formData.outputFormat.includes('word')}
                      onChange={handleOutputFormatChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="word" className="ml-3 text-sm text-gray-700">Word Document</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="notion"
                      name="outputFormat"
                      type="checkbox"
                      value="notion"
                      checked={formData.outputFormat.includes('notion')}
                      onChange={handleOutputFormatChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="notion" className="ml-3 text-sm text-gray-700">Notion Page</label>
                  </div>
                </div>
              </fieldset>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Experiment Summary</h4>
              <div className="mt-2 border-t border-gray-200 pt-2">
                <dl className="divide-y divide-gray-200">
                  <div className="py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{formData.title}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{formData.purpose || 'Not specified'}</dd>
                  </div>
                  <div className="py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Protocol</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {protocol ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Generated
                        </span>
                      ) : 'Not generated'}
                    </dd>
                  </div>
                  <div className="py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Data Files</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formData.files.length > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {formData.files.length} file(s) uploaded
                        </span>
                      ) : 'No files uploaded'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Form Navigation */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-b-lg">
        {currentStep > 1 ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePreviousStep}
          >
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        <div className="flex space-x-3">
          {currentStep < 4 ? (
            <Button 
              type="button" 
              onClick={handleNextStep}
              disabled={currentStep === 3 && !protocol}
            >
              {currentStep === 3 && !protocol ? 'Protocol Required' : 'Next'}
            </Button>
          ) : (
            <Button 
              type="submit"
              variant="primary"
              disabled={formData.files.length === 0}
            >
              Submit Experiment
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

ExperimentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ExperimentForm;