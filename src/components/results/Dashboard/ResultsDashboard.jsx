import React from 'react';
import PropTypes from 'prop-types';

/**
 * Dashboard component for displaying experiment results
 */
const ResultsDashboard = ({ results, experimentInfo }) => {
  // If no results are available yet, show a placeholder
  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No results available yet. Please run an analysis first.</p>
      </div>
    );
  }

  const { textReport, visualizationLinks, documentLinks } = results;

  return (
    <div className="space-y-8">
      {/* Text Report Section */}
      {textReport && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Report</h3>
          <div className="prose prose-blue max-w-none">
            {/* In a real application, we would render the markdown text report here */}
            <div className="whitespace-pre-line">
              {textReport}
            </div>
          </div>
        </div>
      )}

      {/* Visualizations Section */}
      {visualizationLinks && visualizationLinks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Visualizations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visualizationLinks.map((link, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={link} 
                  alt={`Visualization ${index + 1}`} 
                  className="w-full h-auto"
                />
                <div className="p-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700 font-medium">Figure {index + 1}</p>
                  <p className="text-xs text-gray-500">
                    {experimentInfo?.analysisTypes?.[index % experimentInfo.analysisTypes.length] || 'Analysis'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {documentLinks && Object.keys(documentLinks).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Documents</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(documentLinks).map(([format, link]) => (
              <a
                key={format}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                {/* Document Type Icon */}
                <div className="mb-3 p-3 rounded-full bg-blue-50">
                  {format === 'pdf' && (
                    <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                  {format === 'ppt' && (
                    <svg className="h-6 w-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  )}
                  {format === 'word' && (
                    <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                  {format === 'notion' && (
                    <svg className="h-6 w-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm1.775 2.22c.28.233.607.42 1.96.326l11.946-.84c.233-.023.28-.187.187-.34l-.746-.932c-.233-.28-.7-.466-1.26-.42l-11.34.84c-.14.046-.187.187-.093.28l.326.186zm.514 2.8c.14.14.327.233.747.187l10.545-.84c.14-.047.233-.187.187-.326l-.56-1.167c-.094-.233-.327-.326-.607-.28l-9.985.792c-.093 0-.187.093-.187.187l-.14 1.446zm.56 2.52c.094.28.28.327.607.28l7.897-.56c.187-.046.327-.186.28-.326l-.373-.78c-.047-.14-.327-.234-.56-.187l-7.617.56c-.14.046-.19.186-.14.326l-.094.686zm-.093 2.193c.187.187.373.233.84.187l4.935-.373c.233 0 .327-.14.327-.326l-.234-.84c-.046-.094-.4-.287-.7-.234l-4.794.42c-.186.047-.326.187-.28.328l-.094.838zm13.28-6.708c.046-.186-.046-.326-.186-.38l-.652-.327c-.093-.047-.187-.047-.327-.047l-7.663.42c-.093 0-.233.047-.233.187v.888c0 .187.233.28.326.234l8.316-.934c.14-.046.233-.14.42-.046zm-12.53 8.756c.277-.094.363-.327.306-.42l-.266-.56c-.093-.14-.233-.234-.326-.234l-1.96.42c-.093.047-.233.14-.233.326l.046.56c.047.28.327.374.7.327l1.733-.42zm-1.776 2.24c.093.046.233.046.373.046l4.84-.42c.14-.046.233-.14.186-.326l-.046-.56c0-.047-.187-.327-.28-.327l-4.84.46c-.093.048-.186.142-.186.33l-.047.514c0 .093 0 .234.047.28zm15.118-44.125c-.84 0-1.54-.653-1.54-1.54 0-.838.7-1.54 1.54-1.54.793 0 1.54.702 1.54 1.54a1.54 1.54 0 01-1.54 1.54z"/>
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium capitalize">
                  {format === 'pdf' ? 'PDF Report' : 
                   format === 'ppt' ? 'PowerPoint' : 
                   format === 'word' ? 'Word Document' : 
                   format === 'notion' ? 'Notion Page' : format}
                </p>
                <p className="text-xs text-gray-500 mt-1">Download</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Raw Data Section */}
      {results.rawData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Raw Data</h3>
          <div className="overflow-auto max-h-60 bg-gray-50 p-4 rounded-md font-mono text-sm">
            <pre>{results.rawData}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

ResultsDashboard.propTypes = {
  results: PropTypes.shape({
    textReport: PropTypes.string,
    visualizationLinks: PropTypes.arrayOf(PropTypes.string),
    documentLinks: PropTypes.object,
    rawData: PropTypes.string
  }),
  experimentInfo: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    analysisTypes: PropTypes.array,
    visualizationTypes: PropTypes.array
  })
};

export default ResultsDashboard;