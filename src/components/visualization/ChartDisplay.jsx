import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiDownload, FiRefreshCw, FiSettings, FiGrid } from 'react-icons/fi';
import Button from '../../components/common/Button';

/**
 * ChartDisplay Component
 * Displays visualization charts for analysis results and allows customization
 */
const ChartDisplay = ({ 
  visualization, 
  allVisualizations, 
  onSelectVisualization,
  onRequestInterpretation, 
  onExportResults,
  isLoading 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [chartOptions, setChartOptions] = useState(visualization?.chartOptions || {});
  
  // Handle export chart as image
  const handleExportChart = () => {
    if (!visualization) return;
    
    // In a real app, this would capture and save the chart as an image
    onExportResults('png');
  };
  
  // Handle option change in chart settings
  const handleOptionChange = (option, value) => {
    const updatedOptions = {
      ...chartOptions,
      [option]: value
    };
    
    setChartOptions(updatedOptions);
    
    // In a real app, this would update the visualization with new options
    // For now we'll just use the mock data
  };
  
  // Generate chart preview based on type
  const renderChartPreview = () => {
    if (!visualization) return null;
    
    // For demo purposes, we'll render mock charts here
    // In a real app, you would use Chart.js, D3, or other libraries
    
    const getColorForChart = (type) => {
      const colors = {
        bar: '#4f46e5',
        line: '#0ea5e9',
        scatter: '#8b5cf6',
        pie: '#f59e0b',
        box: '#10b981',
        heatmap: '#ef4444'
      };
      return colors[type] || '#4f46e5';
    };
    
    const getChartPreview = () => {
      const color = getColorForChart(visualization.visualType);
      
      switch(visualization.visualType) {
        case 'bar':
          return (
            <div className="h-64 flex items-end justify-around p-4">
              {[0.3, 0.8, 0.5, 0.9, 0.6, 0.4, 0.7].map((height, i) => (
                <div 
                  key={i}
                  className="w-8 rounded-t-md transition-all duration-500"
                  style={{
                    height: `${height * 100}%`,
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>
          );
        case 'line':
          return (
            <div className="h-64 relative p-4">
              <svg className="w-full h-full">
                <path
                  d="M0,120 C100,80 180,140 300,40 C350,20 400,90 500,60"
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                />
                {[0, 100, 200, 300, 400, 500].map((x, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={i % 2 === 0 ? 80 : 120}
                    r="4"
                    fill={color}
                  />
                ))}
              </svg>
            </div>
          );
        case 'scatter':
          return (
            <div className="h-64 relative p-4">
              <svg className="w-full h-full">
                {Array.from({length: 30}).map((_, i) => {
                  const x = Math.random() * 500;
                  const y = Math.random() * 200;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="5"
                      fill={color}
                      opacity="0.7"
                    />
                  );
                })}
              </svg>
            </div>
          );
        case 'pie':
          return (
            <div className="h-64 flex items-center justify-center p-4">
              <svg width="200" height="200" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="15"
                        strokeDasharray="180 360" strokeDashoffset="90" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#93c5fd" strokeWidth="15"
                        strokeDasharray="60 360" strokeDashoffset="270" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6ee7b7" strokeWidth="15"
                        strokeDasharray="50 360" strokeDashoffset="330" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth="15"
                        strokeDasharray="70 360" strokeDashoffset="20" />
              </svg>
            </div>
          );
        case 'box':
          return (
            <div className="h-64 flex items-center p-4">
              <div className="w-full flex items-center justify-around">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-1 w-32 bg-gray-300"></div>
                    <div className="h-40 w-1 bg-gray-300"></div>
                    <div className="h-1 w-32 bg-gray-300"></div>
                    <div 
                      className="h-24 w-16 border-t border-b border-l border-r rounded"
                      style={{ borderColor: color }}
                    ></div>
                    <div className="w-1 h-4 bg-gray-300"></div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'heatmap':
          return (
            <div className="h-64 grid grid-cols-8 grid-rows-5 gap-1 p-4">
              {Array.from({length: 40}).map((_, i) => {
                const opacity = Math.random() * 0.8 + 0.2;
                return (
                  <div
                    key={i}
                    className="rounded"
                    style={{ backgroundColor: color, opacity }}
                  />
                );
              })}
            </div>
          );
        default:
          return (
            <div className="h-64 flex items-center justify-center p-4">
              <p className="text-gray-500">Preview not available for this chart type</p>
            </div>
          );
      }
    };
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {getChartPreview()}
      </div>
    );
  };
  
  if (!visualization) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No visualization selected.</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main chart display */}
        <div className="lg:w-2/3">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">{visualization.visualType.charAt(0).toUpperCase() + visualization.visualType.slice(1)} Chart</h3>
            <p className="text-sm text-gray-500">
              {visualization.dataColumns?.join(', ') || 'All data columns'}
            </p>
          </div>
          
          {/* Chart preview */}
          {renderChartPreview()}
          
          {/* Chart actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2"
            >
              <FiSettings /> {showSettings ? 'Hide Settings' : 'Chart Settings'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExportChart}
              className="flex items-center gap-2"
            >
              <FiDownload /> Export Chart
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // In a real app, this would refresh the visualization with current settings
                setShowSettings(false);
              }}
              className="flex items-center gap-2"
            >
              <FiRefreshCw /> Refresh
            </Button>
          </div>
          
          {/* Chart settings panel */}
          {showSettings && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Chart Settings</h4>
              <div className="space-y-4">
                {/* Color settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chart Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['#4f46e5', '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'].map(color => (
                      <div
                        key={color}
                        onClick={() => handleOptionChange('color', color)}
                        className={`w-6 h-6 rounded-full cursor-pointer border ${
                          chartOptions.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Show legend option */}
                <div>
                  <div className="flex items-center">
                    <input
                      id="show-legend"
                      type="checkbox"
                      checked={chartOptions.showLegend || false}
                      onChange={(e) => handleOptionChange('showLegend', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="show-legend" className="ml-2 block text-sm text-gray-700">
                      Show Legend
                    </label>
                  </div>
                </div>
                
                {/* Chart title */}
                <div>
                  <label htmlFor="chart-title" className="block text-sm font-medium text-gray-700">
                    Chart Title
                  </label>
                  <input
                    type="text"
                    id="chart-title"
                    value={chartOptions.title || ''}
                    onChange={(e) => handleOptionChange('title', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* X-axis label */}
                <div>
                  <label htmlFor="x-axis-label" className="block text-sm font-medium text-gray-700">
                    X-Axis Label
                  </label>
                  <input
                    type="text"
                    id="x-axis-label"
                    value={chartOptions.xAxisLabel || ''}
                    onChange={(e) => handleOptionChange('xAxisLabel', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Y-axis label */}
                <div>
                  <label htmlFor="y-axis-label" className="block text-sm font-medium text-gray-700">
                    Y-Axis Label
                  </label>
                  <input
                    type="text"
                    id="y-axis-label"
                    value={chartOptions.yAxisLabel || ''}
                    onChange={(e) => handleOptionChange('yAxisLabel', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar with all visualizations */}
        <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4">
          <div className="mb-4 flex items-center">
            <FiGrid className="mr-2 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-900">All Visualizations</h4>
          </div>
          
          <div className="space-y-2">
            {allVisualizations && allVisualizations.length > 0 ? (
              allVisualizations.map((vis, index) => (
                <div
                  key={index}
                  onClick={() => onSelectVisualization(vis)}
                  className={`cursor-pointer p-3 rounded-md transition-colors ${
                    visualization.id === vis.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vis.visualType.charAt(0).toUpperCase() + vis.visualType.slice(1)} Chart
                      </p>
                      <p className="text-xs text-gray-500">
                        {vis.dataColumns?.join(', ') || 'All data'}
                      </p>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: getColorForChart(vis.visualType)
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No visualizations available</p>
            )}
          </div>
          
          <div className="mt-6">
            <Button
              type="button"
              onClick={() => onRequestInterpretation(`Interpret the ${visualization.visualType} chart showing ${visualization.dataColumns?.join(', ') || 'data'}`)}
              isLoading={isLoading}
              className="w-full"
            >
              Get AI Insights for This Chart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ChartDisplay.propTypes = {
  visualization: PropTypes.shape({
    id: PropTypes.string,
    visualType: PropTypes.string.isRequired,
    dataColumns: PropTypes.arrayOf(PropTypes.string),
    chartData: PropTypes.object,
    chartOptions: PropTypes.object,
    imageUrl: PropTypes.string
  }),
  allVisualizations: PropTypes.array,
  onSelectVisualization: PropTypes.func.isRequired,
  onRequestInterpretation: PropTypes.func.isRequired,
  onExportResults: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

// Helper function for chart color mapping
const getColorForChart = (type) => {
  const colors = {
    bar: '#4f46e5',
    line: '#0ea5e9',
    scatter: '#8b5cf6',
    pie: '#f59e0b',
    box: '#10b981',
    heatmap: '#ef4444'
  };
  return colors[type] || '#4f46e5';
};

export default ChartDisplay;