import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for selecting visualization types
 */
const VisualizationSelection = ({ selectedVisualizationTypes = [], onChange, error = null }) => {
  // Available visualization types
  const visualizationOptions = [
    {
      id: 'barChart',
      name: 'Bar Charts',
      description: 'Compare values across categories'
    },
    {
      id: 'lineChart',
      name: 'Line Charts',
      description: 'Show trends over time or categories'
    },
    {
      id: 'pieChart',
      name: 'Pie Charts',
      description: 'Show proportion of categories in a whole'
    },
    {
      id: 'scatterPlot',
      name: 'Scatter Plots',
      description: 'Show correlation between two variables'
    },
    {
      id: 'heatmap',
      name: 'Heatmaps',
      description: 'Visualize data density or correlation matrices'
    },
    {
      id: 'histogram',
      name: 'Histograms',
      description: 'Show distribution of a numerical variable'
    },
    {
      id: 'boxPlot',
      name: 'Box Plots',
      description: 'Display distribution and identify outliers'
    },
    {
      id: 'treemap',
      name: 'Treemaps',
      description: 'Hierarchical data as nested rectangles'
    }
  ];
  
  // Handle change in selection
  const handleChange = (visualizationId) => {
    const isSelected = selectedVisualizationTypes.includes(visualizationId);
    
    let updatedSelection;
    if (isSelected) {
      updatedSelection = selectedVisualizationTypes.filter(id => id !== visualizationId);
    } else {
      updatedSelection = [...selectedVisualizationTypes, visualizationId];
    }
    
    onChange(updatedSelection);
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Visualization Types*
      </label>
      <p className="text-sm text-gray-500 mb-3">
        Select the types of visualizations you want to include in your results
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visualizationOptions.map(option => (
          <div 
            key={option.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedVisualizationTypes.includes(option.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}
            onClick={() => handleChange(option.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={selectedVisualizationTypes.includes(option.id)}
                  onChange={() => {}} // Handled by the parent div onClick
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-800 text-sm">
                  {option.name}
                </label>
                <p className="text-gray-500 text-xs mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

VisualizationSelection.propTypes = {
  selectedVisualizationTypes: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default VisualizationSelection;