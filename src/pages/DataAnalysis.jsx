import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiDatabase, FiBarChart2, FiPieChart, FiCpu } from 'react-icons/fi';
import Button from '../components/common/Button';
import FileUpload from '../components/forms/FileUpload/FileUpload';
import AnalysisSelection from '../components/forms/AnalysisSelection/AnalysisSelection';
import AnalysisResults from '../components/analysis/AnalysisResults';
import ChartDisplay from '../components/visualization/ChartDisplay';
import AIInterpretation from '../components/analysis/AIInterpretation';
import { useExperiment } from '../contexts/ExperimentContext';
import analysisService from '../services/analysisService';
import visualizationService from '../services/visualizationService';
import aiService from '../services/aiService';

/**
 * Data Analysis page component
 * Handles data analysis workflow including file upload, analysis selection,
 * result display, visualization, and AI interpretation
 */
const DataAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experiment } = useExperiment();
  
  // State management
  const [step, setStep] = useState('upload'); // upload, select, analyze, results
  const [files, setFiles] = useState([]);
  const [availableMethods, setAvailableMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [methodParams, setMethodParams] = useState({});
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [availableCharts, setAvailableCharts] = useState([]);
  const [visualization, setVisualization] = useState(null);
  const [aiInterpretation, setAIInterpretation] = useState(null);
  const [loading, setLoading] = useState({
    methods: false,
    analysis: false,
    visualization: false,
    interpretation: false
  });
  const [error, setError] = useState(null);

  // Load uploaded files from previous page if available
  useEffect(() => {
    if (location.state?.uploadedFiles?.length > 0) {
      setFiles(location.state.uploadedFiles);
      setStep('select'); // Proceed to selection step if we already have files
    }
    
    // Load available analysis methods
    const loadAnalysisMethods = async () => {
      setLoading(prev => ({ ...prev, methods: true }));
      try {
        const methods = await analysisService.getAvailableAnalysisMethods();
        setAvailableMethods(methods);
      } catch (err) {
        console.error('Failed to load analysis methods:', err);
        setError('Failed to load available analysis methods. Please try again.');
      } finally {
        setLoading(prev => ({ ...prev, methods: false }));
      }
    };
    
    loadAnalysisMethods();
  }, [location.state]);

  // Handle file upload
  const handleFilesUploaded = (uploadedFiles) => {
    setFiles(uploadedFiles);
    if (uploadedFiles.length > 0) {
      setStep('select');
    }
  };

  // Handle analysis method selection
  const handleMethodSelect = (methodId) => {
    const method = availableMethods.find(m => m.id === methodId);
    setSelectedMethod(method);
    
    // Initialize default parameters
    if (method?.parameters) {
      const initialParams = {};
      method.parameters.forEach(param => {
        initialParams[param.id] = param.default;
      });
      setMethodParams(initialParams);
    }
  };

  // Handle parameter changes
  const handleParamChange = (paramId, value) => {
    setMethodParams(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  // Start analysis
  const handleStartAnalysis = async () => {
    if (!selectedMethod || files.length === 0) return;
    
    setLoading(prev => ({ ...prev, analysis: true }));
    setError(null);
    
    try {
      // Create analysis job
      const job = await analysisService.createAnalysisJob({
        methodId: selectedMethod.id,
        params: methodParams,
        fileIds: files.map(f => f.name) // In a real app, you'd use actual file IDs
      });
      
      // For demo purposes, directly fetch results
      // In a real app, you might poll for job completion
      const results = await analysisService.getAnalysisResults(`${selectedMethod.id}-${job.analysisId}`);
      setAnalysisResults(results);
      
      // Get suitable visualizations for this analysis type
      const chartOptions = await visualizationService.getSuitableVisualizationsForAnalysis(selectedMethod.id);
      setAvailableCharts(chartOptions);
      
      if (chartOptions.length > 0) {
        setSelectedChart(chartOptions[0].id);
      }
      
      // Load initial visualization
      if (chartOptions.length > 0) {
        await handleVisualizationChange(chartOptions[0].id);
      }
      
      // Generate AI interpretation
      await generateAIInterpretation(results);
      
      setStep('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to complete analysis. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };
  
  // Generate visualization
  const handleVisualizationChange = async (chartTypeId) => {
    setLoading(prev => ({ ...prev, visualization: true }));
    try {
      if (!analysisResults) return;
      
      setSelectedChart(chartTypeId);
      
      // Create visualization
      const visJob = await visualizationService.createVisualization({
        analysisId: analysisResults.id,
        chartType: chartTypeId,
        dataColumns: ['all'] // In a real app, you'd select specific columns
      });
      
      // For demo purposes, directly fetch results
      const visualization = await visualizationService.getVisualization(`${chartTypeId}-${visJob.visualizationId}`);
      setVisualization(visualization);
    } catch (err) {
      console.error('Visualization failed:', err);
      setError('Failed to generate visualization. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, visualization: false }));
    }
  };
  
  // Generate AI interpretation of results
  const generateAIInterpretation = async (results) => {
    setLoading(prev => ({ ...prev, interpretation: true }));
    try {
      if (!results) return;
      
      // Create interpretation request
      const interpJob = await aiService.createInterpretation({
        analysisId: results.id,
        analysisType: selectedMethod.id,
        query: `Interpret the ${selectedMethod.name} results and provide insights`
      });
      
      // For demo purposes, directly fetch results
      const interpretation = await aiService.getInterpretation(`${selectedMethod.id}-${interpJob.interpretationId}`);
      setAIInterpretation(interpretation);
    } catch (err) {
      console.error('AI interpretation failed:', err);
    } finally {
      setLoading(prev => ({ ...prev, interpretation: false }));
    }
  };

  // Export results in various formats
  const handleExportResults = (format) => {
    if (!analysisResults) return;
    
    analysisService.exportAnalysisResults(analysisResults.id, format)
      .then(result => {
        // In a real app, this would trigger a download
        console.log(`Exported results in ${format} format:`, result);
        alert(`Results would be downloaded as ${format} in a production environment.`);
      })
      .catch(err => {
        console.error(`Export to ${format} failed:`, err);
        setError(`Failed to export results as ${format}. Please try again.`);
      });
  };
  
  // Go back to previous step
  const handleBack = () => {
    if (step === 'select') setStep('upload');
    else if (step === 'results') setStep('select');
    else navigate('/data/collection');
  };
  
  // Navigate to data collection
  const handleBackToCollection = () => {
    navigate('/data/collection');
  };
  
  // Render analysis steps
  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Data Files</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Upload your experimental data files for analysis
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <FileUpload 
                onDataUploaded={handleFilesUploaded}
                acceptedFileTypes={['.csv', '.xlsx', '.json', '.txt']}
                maxFileSize={20}
              />
            </div>
          </div>
        );
        
      case 'select':
        return (
          <div className="space-y-6">
            {/* Files summary */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Data Files</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {files.length} file{files.length !== 1 ? 's' : ''} uploaded for analysis
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('upload')}
                  className="flex items-center gap-2"
                >
                  <FiDatabase /> Manage Files
                </Button>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <ul className="divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <li key={index} className="py-3 flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <p className="text-sm text-gray-500">{file.type}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Analysis selection */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Select Analysis Method</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Choose the appropriate analysis method for your data
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <AnalysisSelection
                  analysisTypes={availableMethods}
                  selectedFile={files[0]}
                  onAnalysisSelect={(methodId, params) => {
                    handleMethodSelect(methodId);
                    setMethodParams(params);
                  }}
                  isLoading={loading.methods}
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToCollection}
                className="flex items-center gap-2"
              >
                <FiChevronLeft /> Back to Data Collection
              </Button>
              
              <Button
                type="button"
                onClick={handleStartAnalysis}
                disabled={!selectedMethod || loading.analysis}
                className="flex items-center gap-2"
              >
                {loading.analysis ? "Analyzing..." : "Start Analysis"} <FiCpu />
              </Button>
            </div>
          </div>
        );
        
      case 'results':
        return (
          <div className="space-y-6">
            {/* Analysis results */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedMethod?.name} Results</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Analysis of {files.length} data file{files.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <AnalysisResults
                  results={analysisResults}
                  selectedAnalysis={selectedMethod ? selectedMethod.id : ''}
                  visualizationTypes={availableCharts}
                  onGenerateVisualization={handleVisualizationChange}
                  onRequestInterpretation={() => generateAIInterpretation(analysisResults)}
                  onExportResults={handleExportResults}
                  isLoading={loading.analysis}
                />
              </div>
            </div>
            
            {/* Visualization */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Data Visualization</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Visual representation of your analysis results
                  </p>
                </div>
                {availableCharts.length > 0 && (
                  <div className="flex items-center">
                    <label htmlFor="chart-type" className="block text-sm font-medium text-gray-700 mr-2">
                      Chart Type:
                    </label>
                    <select
                      id="chart-type"
                      value={selectedChart || ''}
                      onChange={(e) => handleVisualizationChange(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {availableCharts.map(chart => (
                        <option key={chart.id} value={chart.id}>
                          {chart.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200">
                <ChartDisplay
                  visualization={visualization}
                  isLoading={loading.visualization}
                />
              </div>
            </div>
            
            {/* AI Interpretation */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">AI Interpretation</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  ChatGPT-powered insights and interpretation of your results
                </p>
              </div>
              <div className="border-t border-gray-200">
                <AIInterpretation
                  interpretation={aiInterpretation}
                  analysisResults={analysisResults}
                  visualization={visualization}
                  onExportResults={handleExportResults}
                  isLoading={loading.interpretation}
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <FiChevronLeft /> Change Analysis
              </Button>
              
              <Button
                type="button"
                onClick={() => setStep('select')}
                className="flex items-center gap-2"
              >
                New Analysis <FiBarChart2 />
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Analysis</h1>
        <p className="mt-2 text-sm text-gray-500">
          Analyze your experimental data and get AI-powered insights
        </p>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-700">
          {error}
        </div>
      )}
      
      {/* Progress steps indicator */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            <li className={`relative pr-8 sm:pr-20 ${step === 'upload' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className={`h-0.5 w-full ${step === 'upload' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              </div>
              <span className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                step === 'upload' ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-300'
              }`}>
                <FiDatabase className={step === 'upload' ? 'text-white' : 'text-gray-500'} />
              </span>
              <span className="absolute top-10 text-center w-32 -ml-16 text-xs font-medium">Upload Data</span>
            </li>
            
            <li className={`relative pr-8 sm:pr-20 ${step === 'select' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className={`h-0.5 w-full ${step === 'select' || step === 'results' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              </div>
              <span className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                step === 'select' ? 'bg-blue-600 text-white' : 
                step === 'results' ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-300'
              }`}>
                <FiBarChart2 className={step === 'select' || step === 'results' ? 'text-white' : 'text-gray-500'} />
              </span>
              <span className="absolute top-10 text-center w-32 -ml-16 text-xs font-medium">Select Analysis</span>
            </li>
            
            <li className={`relative ${step === 'results' ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                step === 'results' ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-300'
              }`}>
                <FiPieChart className={step === 'results' ? 'text-white' : 'text-gray-500'} />
              </span>
              <span className="absolute top-10 text-center w-32 -ml-16 text-xs font-medium">View Results</span>
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Main content */}
      {renderStep()}
    </div>
  );
};

export default DataAnalysis;