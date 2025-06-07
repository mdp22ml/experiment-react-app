import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import ResultsDashboard from '../components/results/Dashboard/ResultsDashboard';
import { getExperiment } from '../services/experimentService';
import { exportToNotion, sendToSlack } from '../services/integrationService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

/**
 * Page for displaying experiment results
 */
const ExperimentResults = () => {
  const { id } = useParams();
  const { experiment, setExperimentData, updateStatus, handleError } = useExperiment();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('report');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(null);
  
  useEffect(() => {
    const loadExperiment = async () => {
      setIsLoading(true);
      
      try {
        // Load experiment data if not already available or if ID changes
        if (!experiment.id || experiment.id !== id) {
          updateStatus('processing');
          
          // Get experiment data from the service
          const experimentData = await getExperiment(id);
          
          setExperimentData({
            ...experimentData,
            status: 'completed'
          });
          
          updateStatus('completed');
        }
      } catch (error) {
        console.error('Error loading experiment:', error);
        handleError(error.message || 'Failed to load experiment results');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExperiment();
  }, [id, experiment.id, setExperimentData, updateStatus, handleError]);
  
  // Handle exporting to Notion
  const handleExportToNotion = async () => {
    setIsExporting(true);
    setExportSuccess(null);
    
    try {
      await exportToNotion(experiment);
      setExportSuccess('Experiment successfully exported to Notion');
    } catch (error) {
      console.error('Error exporting to Notion:', error);
      setExportSuccess(null);
      handleError('Failed to export to Notion: ' + error.message);
    } finally {
      setIsExporting(false);
      
      // Clear success message after 3 seconds
      if (setExportSuccess) {
        setTimeout(() => {
          setExportSuccess(null);
        }, 3000);
      }
    }
  };
  
  // Handle sharing to Slack
  const handleShareToSlack = async () => {
    setIsExporting(true);
    setExportSuccess(null);
    
    try {
      await sendToSlack(experiment);
      setExportSuccess('Experiment successfully shared on Slack');
    } catch (error) {
      console.error('Error sharing to Slack:', error);
      setExportSuccess(null);
      handleError('Failed to share on Slack: ' + error.message);
    } finally {
      setIsExporting(false);
      
      // Clear success message after 3 seconds
      if (setExportSuccess) {
        setTimeout(() => {
          setExportSuccess(null);
        }, 3000);
      }
    }
  };
  
  // If loading, show loader
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <Loader size="large" text="Loading experiment results..." />
      </div>
    );
  }
  
  // If experiment failed to load or doesn't exist
  if (experiment.status === 'error' || !experiment.results) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {experiment.error || 'Failed to load experiment results. The experiment might not exist or an error occurred.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{experiment.title || 'Experiment Results'}</h1>
          <p className="mt-2 text-sm text-gray-500">
            Analysis completed on {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportToNotion}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export to Notion'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShareToSlack}
            disabled={isExporting}
          >
            {isExporting ? 'Sharing...' : 'Share to Slack'}
          </Button>
        </div>
      </div>
      
      {/* Success message */}
      {exportSuccess && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {exportSuccess}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Content tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'report'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('report')}
          >
            Report
          </button>
          <button
            className={`${
              activeTab === 'raw'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('raw')}
          >
            Raw Data
          </button>
        </nav>
      </div>
      
      {/* Display the appropriate tab content */}
      <div className="pb-12">
        {activeTab === 'report' ? (
          <ResultsDashboard 
            results={experiment.results} 
            experimentInfo={experiment} 
          />
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Raw Experiment Data</h3>
              <div className="mt-4 bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-xs text-gray-800">
                  {JSON.stringify(experiment, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentResults;