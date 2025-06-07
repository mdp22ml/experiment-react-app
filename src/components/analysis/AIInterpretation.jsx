import React from 'react';
import PropTypes from 'prop-types';
import { FiMessageCircle, FiThumbsUp, FiThumbsDown, FiShare2, FiDownload } from 'react-icons/fi';
import Button from '../../components/common/Button';

/**
 * AIInterpretation Component
 * Displays AI-generated insights and interpretations of data analysis results
 */
const AIInterpretation = ({ 
  interpretation, 
  analysisResults,
  visualization,
  onExportResults,
  isLoading 
}) => {
  // Extract insights and format them as needed
  const insights = interpretation?.insights || [];
  const suggestions = interpretation?.suggestions || [];
  
  // Handle feedback submission
  const handleFeedback = (isPositive) => {
    // In a real implementation, this would send feedback to the backend
    console.log(`User provided ${isPositive ? 'positive' : 'negative'} feedback on interpretation`);
    
    // Show a temporary message to the user
    const feedbackElement = document.getElementById('feedback-message');
    if (feedbackElement) {
      feedbackElement.textContent = `Thank you for your feedback!`;
      feedbackElement.classList.remove('hidden');
      
      setTimeout(() => {
        feedbackElement.classList.add('hidden');
      }, 3000);
    }
  };
  
  if (!interpretation) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="mt-4 h-32 bg-gray-200 rounded w-full mx-auto"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading AI interpretation...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Main interpretation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <FiMessageCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Interpretation</h3>
            <div className="prose prose-blue max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">{interpretation.answer}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key insights section */}
      {insights.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Key Insights
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Important findings identified by AI
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {insights.map((insight, index) => (
                <li key={index} className="px-4 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{insight}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Suggestions section */}
      {suggestions.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Suggestions
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Recommendations based on your analysis
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="px-4 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{suggestion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Related results summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-base leading-6 font-medium text-gray-900">
              Analysis Context
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
              {analysisResults && (
                <>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Analysis Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {analysisResults.analysisType || 'Statistical Analysis'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Data Points</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {analysisResults.dataPoints || '250'}
                    </dd>
                  </div>
                </>
              )}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Analysis Summary</dt>
                <dd className="mt-1 text-sm text-gray-900 line-clamp-3">
                  {analysisResults?.textualSummary || 'No summary available'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {visualization && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-base leading-6 font-medium text-gray-900">
                Related Visualization
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  {visualization.visualType.charAt(0).toUpperCase() + visualization.visualType.slice(1)} Chart
                </p>
                <div className="h-32 bg-gray-100 mt-2 rounded flex items-center justify-center">
                  <p className="text-sm text-gray-500">Visualization preview would display here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Feedback and Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-700 mr-2 mb-2">Was this interpretation helpful?</p>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleFeedback(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiThumbsUp className="mr-1" /> Yes
              </button>
              <button 
                onClick={() => handleFeedback(false)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiThumbsDown className="mr-1" /> No
              </button>
              <p id="feedback-message" className="text-sm text-green-600 hidden ml-2"></p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onExportResults('pdf')}
              className="flex items-center gap-2"
            >
              <FiDownload /> Export Results
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // In a real app, implement sharing functionality
                const shareMessage = 'Sharing functionality would be implemented here';
                alert(shareMessage);
              }}
              className="flex items-center gap-2"
            >
              <FiShare2 /> Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

AIInterpretation.propTypes = {
  interpretation: PropTypes.shape({
    id: PropTypes.string,
    analysisId: PropTypes.string,
    query: PropTypes.string,
    answer: PropTypes.string,
    insights: PropTypes.arrayOf(PropTypes.string),
    suggestions: PropTypes.arrayOf(PropTypes.string)
  }),
  analysisResults: PropTypes.object,
  visualization: PropTypes.object,
  onExportResults: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default AIInterpretation;