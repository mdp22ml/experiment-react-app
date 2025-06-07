import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperimentForm from '../components/forms/ExperimentForm/ExperimentForm';
import { useExperiment } from '../contexts/ExperimentContext';
import Loader from '../components/common/Loader';

/**
 * Page for creating a new experiment
 */
const ExperimentCreate = () => {
  const navigate = useNavigate();
  const { updateExperiment, submitExperiment, loading, error } = useExperiment();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle experiment form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Submit the experiment via context
      const experimentResult = await submitExperiment();
      
      // Redirect to results page
      navigate(`/experiment/results/${experimentResult.id || 'new'}`);
    } catch (error) {
      console.error('Error creating experiment:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Experiment</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload your data files and configure analysis settings
        </p>
      </div>
      
      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size="large" text="Processing your experiment..." />
          <p className="mt-6 text-sm text-gray-500">
            Please wait while we analyze your data and generate results
          </p>
        </div>
      ) : (
        <ExperimentForm onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default ExperimentCreate;