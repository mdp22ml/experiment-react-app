import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import experimentService from '../services/experimentService';
import protocolService from '../services/protocolService';

// Create context
const ExperimentContext = createContext();

/**
 * Provider component for experiment-related data and operations
 */
export function ExperimentProvider({ children }) {
  // State for the current experiment being created or viewed
  const [experiment, setExperiment] = useState({
    title: '',
    purpose: '',
    designRationale: '',
    files: [],
    analysisTypes: [],
    visualizationTypes: [],
    outputFormat: ['pdf'],
    dataFiles: [], // To store uploaded data files
  });

  // State for protocol related to the experiment
  const [protocol, setProtocol] = useState(null);
  
  // State for the experiment results
  const [results, setResults] = useState(null);
  
  // Loading state for async operations
  const [loading, setLoading] = useState(false);
  
  // Error state for handling errors
  const [error, setError] = useState(null);

  // Function to update experiment data
  const updateExperiment = (data) => {
    setExperiment(prev => ({ ...prev, ...data }));
  };
  
  // Function to update experiment data files specifically
  const updateExperimentData = (data) => {
    setExperiment(prev => ({ ...prev, ...data }));
  };

  // Generate a protocol based on current experiment data
  const generateProtocol = async () => {
    if (!experiment.title) {
      setError("Experiment title is required to generate a protocol");
      return null;
    }
    
    setLoading(true);
    try {
      const newProtocol = await protocolService.generateProtocol(experiment);
      setProtocol(newProtocol);
      setLoading(false);
      return newProtocol;
    } catch (err) {
      setError(err.message || "Failed to generate protocol");
      setLoading(false);
      return null;
    }
  };

  // Update an existing protocol
  const updateProtocol = (updatedProtocol) => {
    setProtocol(updatedProtocol);
  };

  // Submit experiment for processing
  const submitExperiment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Include protocol in experiment submission if available
      const experimentToSubmit = {
        ...experiment,
        protocol: protocol || undefined
      };
      
      const result = await experimentService.createExperiment(experimentToSubmit);
      
      setResults(result);
      setLoading(false);
      
      return result;
    } catch (err) {
      setError(err.message || "Failed to submit experiment");
      setLoading(false);
      throw err;
    }
  };

  // Fetch experiment by ID
  const fetchExperiment = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await experimentService.getExperiment(id);
      
      setExperiment(result);
      if (result.results) {
        setResults(result.results);
      }
      
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || "Failed to fetch experiment");
      setLoading(false);
      throw err;
    }
  };

  // Reset experiment state
  const resetExperiment = () => {
    setExperiment({
      title: '',
      purpose: '',
      designRationale: '',
      files: [],
      analysisTypes: [],
      visualizationTypes: [],
      outputFormat: ['pdf'],
    });
    setProtocol(null);
    setResults(null);
    setError(null);
  };

  // Context value with all state and functions
  const value = {
    experiment,
    protocol,
    results,
    loading,
    error,
    updateExperiment,
    updateExperimentData,
    generateProtocol,
    updateProtocol,
    submitExperiment,
    fetchExperiment,
    resetExperiment,
  };

  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
}

ExperimentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for using experiment context
export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (context === undefined) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
}

export default ExperimentContext;