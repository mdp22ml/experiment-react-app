import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiBarChart2, FiPieChart, FiGrid, FiDownload, FiZap, FiInfo } from 'react-icons/fi';
import Button from '../../components/common/Button';

/**
 * AnalysisResults Component
 * Displays the results of data analysis with options to visualize data and get AI interpretation
 */
const AnalysisResults = ({ 
  results, 
  selectedAnalysis, 
  visualizationTypes, 
  onGenerateVisualization, 
  onRequestInterpretation, 
  onExportResults,
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'data', 'visualization'
  const [selectedVisualizationType, setSelectedVisualizationType] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [visualizationParams, setVisualizationParams] = useState({});
  
  // Handle column selection for visualization
  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };
  
  // Handle visualization parameter change
  const handleParamChange = (param, value) => {
    setVisualizationParams({
      ...visualizationParams,
      [param]: value
    });
  };
  
  // Handle visualization generation
  const handleGenerateVisualization = () => {
    if (!selectedVisualizationType) return;
    
    onGenerateVisualization(
      selectedVisualizationType, 
      selectedColumns.length > 0 ? selectedColumns : null,
      visualizationParams
    );
  };

  // Extract available data columns from results
  const getAvailableColumns = () => {
    if (!results || !results.numericalResults) return [];
    
    // In a real app, we would extract column names from the data
    // For this demo, we'll use mock columns based on analysis type
    const mockColumns = {
      'descriptive': ['mean', 'median', 'mode', 'std_dev', 'variance', 'min', 'max'],
      'hypothesis': ['t_statistic', 'p_value', 'confidence_interval', 'effect_size'],
      'correlation': ['variable_1', 'variable_2', 'correlation_coefficient', 'p_value'],
      'regression': ['coefficient', 'r_squared', 'p_value', 'std_error'],
      'pca': ['component_1', 'component_2', 'component_3', 'explained_variance'],
      'cluster': ['cluster_id', 'centroid_x', 'centroid_y', 'inertia']
    };
    
    return mockColumns[selectedAnalysis] || ['data_1', 'data_2', 'data_3', 'data_4'];
  };
  
  // If no results yet, show a loading state
  if (!results) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="mt-4 h-32 bg-gray-200 rounded w-full mx-auto"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading analysis results...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Tabs for navigating result sections */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-4 px-1 ${
              activeTab === 'summary'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm focus:outline-none`}
          >
            <FiInfo className="inline-block mr-2" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-4 px-1 ${
              activeTab === 'data'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm focus:outline-none`}
          >
            <FiGrid className="inline-block mr-2" />
            Data Table
          </button>
          <button
            onClick={() => setActiveTab('visualization')}
            className={`py-4 px-1 ${
              activeTab === 'visualization'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } font-medium text-sm focus:outline-none`}
          >
            <FiBarChart2 className="inline-block mr-2" />
            Visualization
          </button>
        </nav>
      </div>
      
      {/* Summary Tab Content */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Analysis Summary
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {selectedAnalysis.charAt(0).toUpperCase() + selectedAnalysis.slice(1)} Analysis
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="text-sm text-gray-900">
                <p className="whitespace-pre-wrap">{results.textualSummary}</p>
              </div>
            </div>
          </div>
          
          {/* Key Findings */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Key Findings
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {Object.entries(results.numericalResults || {}).map(([key, value], index) => (
                  <div key={key} className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}>
                    <dt className="text-sm font-medium text-gray-500">{key.replace(/_/g, ' ')}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {typeof value === 'number' ? value.toFixed(4) : JSON.stringify(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => onExportResults('pdf')}
              className="flex items-center gap-2"
            >
              <FiDownload /> Export Results
            </Button>
            <Button
              type="button"
              onClick={() => onRequestInterpretation()}
              isLoading={isLoading}
              className="flex items-center gap-2"
            >
              <FiZap /> Get AI Interpretation
            </Button>
          </div>
        </div>
      )}
      
      {/* Data Table Tab Content */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="overflow-x-auto bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {getAvailableColumns().map((column) => (
                    <th 
                      key={column}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Generate mock data rows */}
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {getAvailableColumns().map((column, colIndex) => (
                      <td 
                        key={`${column}-${rowIndex}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {typeof results.numericalResults?.[column] === 'number' 
                          ? (results.numericalResults[column] * (rowIndex + 0.5)).toFixed(3) 
                          : `${column}-${rowIndex + 1}`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => onExportResults('csv')}
              className="flex items-center gap-2"
            >
              <FiDownload /> Export as CSV
            </Button>
            <Button
              type="button"
              onClick={() => setActiveTab('visualization')}
              className="flex items-center gap-2"
            >
              <FiBarChart2 /> Visualize Data
            </Button>
          </div>
        </div>
      )}
      
      {/* Visualization Tab Content */}
      {activeTab === 'visualization' && (
        <div className="space-y-6">
          {/* Visualization type selection */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Create Visualization
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Visualization Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {visualizationTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedVisualizationType(type.id)}
                    className={`cursor-pointer border rounded-md p-4 transition-all ${
                      selectedVisualizationType === type.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {type.id === 'bar' && <FiBarChart2 className="mr-2 text-gray-400" />}
                      {type.id === 'pie' && <FiPieChart className="mr-2 text-gray-400" />}
                      {!['bar', 'pie'].includes(type.id) && <FiGrid className="mr-2 text-gray-400" />}
                      <span>{type.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Data column selection */}
            {selectedVisualizationType && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Data Columns
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {getAvailableColumns().map((column) => (
                    <div key={column} className="flex items-center">
                      <input
                        id={`column-${column}`}
                        type="checkbox"
                        checked={selectedColumns.includes(column)}
                        onChange={() => handleColumnToggle(column)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`column-${column}`} className="ml-2 text-sm text-gray-700">
                        {column.replace(/_/g, ' ')}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedColumns.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    If no columns are selected, all applicable data will be used
                  </p>
                )}
              </div>
            )}
            
            {/* Additional parameters based on visualization type */}
            {selectedVisualizationType && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visualization Options
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="chart-title" className="block text-sm font-medium text-gray-700">
                      Chart Title
                    </label>
                    <input
                      type="text"
                      id="chart-title"
                      value={visualizationParams.title || ''}
                      onChange={(e) => handleParamChange('title', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter chart title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="color-scheme" className="block text-sm font-medium text-gray-700">
                      Color Scheme
                    </label>
                    <select
                      id="color-scheme"
                      value={visualizationParams.colorScheme || 'default'}
                      onChange={(e) => handleParamChange('colorScheme', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="default">Default</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="red">Red</option>
                      <option value="purple">Purple</option>
                      <option value="rainbow">Rainbow</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              type="button"
              onClick={handleGenerateVisualization}
              disabled={!selectedVisualizationType || isLoading}
              isLoading={isLoading}
              className="w-full sm:w-auto"
            >
              Generate Visualization
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

AnalysisResults.propTypes = {
  results: PropTypes.shape({
    id: PropTypes.string,
    jobId: PropTypes.string,
    numericalResults: PropTypes.object,
    textualSummary: PropTypes.string,
    errorMessage: PropTypes.string,
    visualizationIds: PropTypes.arrayOf(PropTypes.string),
    aiInterpretationId: PropTypes.string
  }),
  selectedAnalysis: PropTypes.string,
  visualizationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ),
  onGenerateVisualization: PropTypes.func.isRequired,
  onRequestInterpretation: PropTypes.func.isRequired,
  onExportResults: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default AnalysisResults;