import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProtocolTemplate from '../components/protocol/ProtocolTemplate';
import ProtocolEditor from '../components/protocol/ProtocolEditor';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useExperiment } from '../contexts/ExperimentContext';
import protocolService from '../services/protocolService';

/**
 * Protocol Generation Page
 * This page allows users to generate, edit, and save protocol documents
 * based on their experiment data.
 */
const ProtocolGeneration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { experiment, protocol, loading, error, generateProtocol, updateProtocol } = useExperiment();
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for tracking if protocol was generated
  const [isGenerated, setIsGenerated] = useState(false);
  // Success message
  const [successMessage, setSuccessMessage] = useState('');
  
  // Effect to generate protocol when page loads if data is passed via location state
  useEffect(() => {
    const generateInitialProtocol = async () => {
      if (!protocol && (location.state?.experimentData || experiment.title)) {
        await handleGenerateProtocol();
      } else if (protocol) {
        setIsGenerated(true);
      }
    };
    
    generateInitialProtocol();
  }, [location.state, protocol]);
  
  // Generate protocol based on experiment data
  const handleGenerateProtocol = async () => {
    setIsGenerated(false);
    
    try {
      const newProtocol = await generateProtocol();
      if (newProtocol) {
        setIsGenerated(true);
        setIsEditing(false);
        setSuccessMessage('Protocol successfully generated!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error generating protocol:', err);
    }
  };
  
  // Handle saving protocol changes
  const handleSaveProtocol = (updatedProtocol) => {
    updateProtocol(updatedProtocol);
    setIsEditing(false);
    setSuccessMessage('Protocol changes saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Continue to data collection
  const handleContinueToDataCollection = () => {
    navigate('/data/collection', { state: { protocol } });
  };
  
  // Go back to experiment form with protocol data
  const handleContinueToExperiment = () => {
    navigate('/experiment/create', { state: { protocol } });
  };
  
  // Download protocol as PDF
  const handleDownloadProtocol = async () => {
    try {
      setSuccessMessage('Preparing protocol for download...');
      const format = experiment.outputFormat?.[0] || 'pdf';
      const result = await protocolService.downloadProtocol(protocol, format);
      setSuccessMessage(result);
      
      // Create a dummy download to simulate the PDF download
      // In a real implementation, this would use actual PDF data
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(protocol, null, 2)], {type: 'application/pdf'});
      element.href = URL.createObjectURL(file);
      element.download = `${protocol.title.replace(/\s+/g, '_')}_protocol.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error downloading protocol:', err);
      setSuccessMessage('Failed to download protocol. Please try again.');
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Protocol Generation</h1>
        <p className="mt-2 text-sm text-gray-500">
          Generate and customize your experiment protocol
        </p>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader size="large" text="Generating protocol..." />
        </div>
      )}
      
      {/* Protocol Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button 
          type="button" 
          onClick={handleGenerateProtocol}
          disabled={loading}
        >
          {isGenerated ? 'Regenerate Protocol' : 'Generate Protocol'}
        </Button>
        
        {isGenerated && !isEditing && (
          <>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsEditing(true)}
            >
              Edit Protocol
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleDownloadProtocol}
            >
              Download as PDF
            </Button>
            
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleContinueToDataCollection}
            >
              Continue to Data Collection
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleContinueToExperiment}
            >
              Back to Experiment Setup
            </Button>
          </>
        )}
        
        {isEditing && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsEditing(false)}
          >
            Cancel Editing
          </Button>
        )}
      </div>
      
      {/* Protocol Display/Editor */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isGenerated && protocol ? (
          isEditing ? (
            <ProtocolEditor 
              protocol={protocol} 
              onSave={handleSaveProtocol} 
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProtocolTemplate protocol={protocol} />
          )
        ) : !loading && !isGenerated ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              No protocol generated yet. Click the "Generate Protocol" button to create a protocol based on your experiment data.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProtocolGeneration;