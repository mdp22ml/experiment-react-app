import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import Button from '../../../components/common/Button';

/**
 * AnalysisSelection Component
 * Allows users to select from available analysis methods and configure parameters
 */
const AnalysisSelection = ({ 
  analysisTypes, 
  selectedFile, 
  onAnalysisSelect, 
  isLoading 
}) => {
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(null);
  const [parameters, setParameters] = useState({});
  const [isInfoOpen, setIsInfoOpen] = useState({});
  
  // Reset parameters when analysis type changes
  useEffect(() => {
    if (selectedAnalysisType) {
      // Find the selected analysis type
      const analysisType = analysisTypes.find(type => type.id === selectedAnalysisType);
      
      if (analysisType && analysisType.parameters) {
        // Initialize parameters with default values
        const initialParameters = {};
        analysisType.parameters.forEach(param => {
          initialParameters[param.id] = param.default || '';
        });
        setParameters(initialParameters);
      } else {
        setParameters({});
      }
    }
  }, [selectedAnalysisType, analysisTypes]);
  
  // Handle parameter change
  const handleParameterChange = (paramId, value) => {
    setParameters({
      ...parameters,
      [paramId]: value
    });
  };
  
  // Toggle info panel for a parameter
  const toggleInfo = (paramId) => {
    setIsInfoOpen({
      ...isInfoOpen,
      [paramId]: !isInfoOpen[paramId]
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnalysisType) return;
    
    onAnalysisSelect(selectedAnalysisType, parameters);
  };
  
  // Get the selected analysis type object
  const getSelectedAnalysisTypeObject = () => {
    return analysisTypes.find(type => type.id === selectedAnalysisType);
  };
  
  // If no analysis types are available yet, show loading state
  if (!analysisTypes || analysisTypes.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="mt-4 h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="mt-6 h-32 bg-gray-200 rounded w-full mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading available analysis methods...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* File info */}
      {selectedFile && (
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900">Selected Data File</h4>
          <p className="text-sm text-gray-500 mt-1">{selectedFile.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
            {selectedFile.type ? ` • ${selectedFile.type}` : ''}
          </p>
        </div>
      )}
      
      {/* Analysis type selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Select Analysis Method</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisTypes.map((type) => (
            <div 
              key={type.id}
              onClick={() => setSelectedAnalysisType(type.id)}
              className={`cursor-pointer border rounded-md p-4 transition-all ${
                selectedAnalysisType === type.id 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start">
                <div className={`mr-2 flex-shrink-0 ${
                  selectedAnalysisType === type.id ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <FiCheckCircle className={`h-5 w-5 ${
                    selectedAnalysisType === type.id ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900">{type.name}</h5>
                  <p className="mt-1 text-xs text-gray-500">{type.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Parameters for selected analysis */}
      {selectedAnalysisType && (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Configure Parameters</h4>
            <div className="bg-white border border-gray-200 rounded-md p-4">
              {getSelectedAnalysisTypeObject()?.parameters?.map((param) => (
                <div key={param.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor={`param-${param.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {param.name}
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleInfo(param.id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiHelpCircle className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {isInfoOpen[param.id] && (
                    <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      {param.description}
                    </div>
                  )}
                  
                  {param.type === 'select' ? (
                    <select
                      id={`param-${param.id}`}
                      value={parameters[param.id] || ''}
                      onChange={(e) => handleParameterChange(param.id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required={param.required}
                    >
                      {param.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : param.type === 'number' ? (
                    <input
                      type="number"
                      id={`param-${param.id}`}
                      value={parameters[param.id] || ''}
                      onChange={(e) => handleParameterChange(param.id, e.target.value)}
                      min={param.min}
                      max={param.max}
                      step={param.step || 1}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required={param.required}
                    />
                  ) : param.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      id={`param-${param.id}`}
                      checked={Boolean(parameters[param.id])}
                      onChange={(e) => handleParameterChange(param.id, e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <input
                      type="text"
                      id={`param-${param.id}`}
                      value={parameters[param.id] || ''}
                      onChange={(e) => handleParameterChange(param.id, e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required={param.required}
                    />
                  )}
                  
                  {param.hint && (
                    <p className="mt-1 text-xs text-gray-500">{param.hint}</p>
                  )}
                </div>
              ))}
              
              {getSelectedAnalysisTypeObject()?.parameters?.length === 0 && (
                <p className="text-sm text-gray-500">No parameters needed for this analysis type.</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!selectedAnalysisType || isLoading}
              isLoading={isLoading}
            >
              Run Analysis
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

AnalysisSelection.propTypes = {
  analysisTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      parameters: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          description: PropTypes.string,
          required: PropTypes.bool,
          default: PropTypes.any,
          options: PropTypes.arrayOf(
            PropTypes.shape({
              value: PropTypes.any.isRequired,
              label: PropTypes.string.isRequired
            })
          ),
          min: PropTypes.number,
          max: PropTypes.number,
          step: PropTypes.number,
          hint: PropTypes.string
        })
      )
    })
  ).isRequired,
  selectedFile: PropTypes.object,
  onAnalysisSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default AnalysisSelection;