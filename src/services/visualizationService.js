/**
 * visualizationService.js
 * Service for handling data visualization operations and API calls
 */

// Helper function to generate mock IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Get available chart types for visualization
 * @param {Object} dataTypes Optional data types to filter chart options
 * @returns {Promise<Array>} Array of chart type objects
 */
const getAvailableChartTypes = async (dataTypes = null) => {
  // In a real implementation, this would fetch from an API and filter based on data types
  // For now, we'll return mock data
  return [
    {
      id: 'bar',
      name: 'Bar Chart',
      description: 'Compare values across categories',
      suitableFor: ['categorical', 'discrete']
    },
    {
      id: 'line',
      name: 'Line Chart',
      description: 'Show trends over time or ordered categories',
      suitableFor: ['time-series', 'continuous', 'ordered']
    },
    {
      id: 'scatter',
      name: 'Scatter Plot',
      description: 'Visualize relationships between two variables',
      suitableFor: ['continuous', 'correlation']
    },
    {
      id: 'pie',
      name: 'Pie Chart',
      description: 'Show proportion of categories in a whole',
      suitableFor: ['categorical', 'proportion']
    },
    {
      id: 'box',
      name: 'Box Plot',
      description: 'Display distribution and identify outliers',
      suitableFor: ['continuous', 'distribution']
    },
    {
      id: 'heatmap',
      name: 'Heat Map',
      description: 'Visualize matrix data like correlations',
      suitableFor: ['matrix', 'correlation']
    }
  ];
};

/**
 * Get suitable visualizations for a specific analysis type
 * @param {string} analysisType Type of analysis
 * @returns {Promise<Array>} Array of recommended chart types
 */
const getSuitableVisualizationsForAnalysis = async (analysisType) => {
  // In a real implementation, this would fetch recommendations based on analysis type
  // For now, we'll return mock recommendations
  
  const recommendations = {
    descriptive: ['bar', 'box', 'pie'],
    hypothesis: ['bar', 'box'],
    correlation: ['scatter', 'heatmap'],
    regression: ['scatter', 'line'],
    pca: ['scatter'],
    cluster: ['scatter', 'heatmap']
  };
  
  // Get all chart types
  const allChartTypes = await getAvailableChartTypes();
  
  // Filter based on recommendations for this analysis
  const recommendedTypes = recommendations[analysisType] || ['bar', 'line', 'scatter'];
  
  return allChartTypes.filter(chart => recommendedTypes.includes(chart.id));
};

/**
 * Create a new visualization for analysis results
 * @param {Object} params Parameters for visualization
 * @returns {Promise<Object>} Visualization job object with ID and status
 */
const createVisualization = async (params) => {
  // In a real implementation, this would make an API call
  // For now, we'll simulate creating a visualization
  const visualizationId = generateId();
  
  return {
    visualizationId,
    status: 'processing',
    params
  };
};

/**
 * Get visualization data by ID
 * @param {string} visualizationId ID of the visualization
 * @returns {Promise<Object>} Visualization data and metadata
 */
const getVisualization = async (visualizationId) => {
  // In a real implementation, this would fetch from an API
  // For now, we'll return mock visualization data
  
  // Extract the visualization type from the ID (in a real app, you'd fetch this)
  const type = visualizationId.includes('bar') ? 'bar' :
               visualizationId.includes('line') ? 'line' :
               visualizationId.includes('scatter') ? 'scatter' :
               visualizationId.includes('pie') ? 'pie' :
               visualizationId.includes('box') ? 'box' :
               'heatmap';
  
  // Mock chart data based on type
  const mockChartData = {
    bar: {
      labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
      datasets: [{
        data: [65, 59, 80, 81, 56],
        backgroundColor: '#4f46e5'
      }]
    },
    line: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#0ea5e9',
        fill: false
      }]
    },
    scatter: {
      datasets: [{
        data: [
          { x: 12, y: 19 },
          { x: 21, y: 13 },
          { x: 15, y: 8 },
          { x: 18, y: 14 },
          { x: 7, y: 23 },
          { x: 9, y: 17 }
        ],
        backgroundColor: '#8b5cf6'
      }]
    },
    pie: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
      datasets: [{
        data: [12, 19, 3, 5, 2],
        backgroundColor: ['#f87171', '#60a5fa', '#fbbf24', '#4ade80', '#a78bfa']
      }]
    },
    box: {
      labels: ['Sample A', 'Sample B', 'Sample C'],
      datasets: [{
        data: [
          { min: 2, q1: 5, median: 8, q3: 12, max: 18, outliers: [1, 20] },
          { min: 5, q1: 9, median: 13, q3: 17, max: 22 },
          { min: 7, q1: 12, median: 16, q3: 22, max: 28, outliers: [30] }
        ]
      }]
    },
    heatmap: {
      data: [
        [0.8, 0.2, 0.5, 0.1],
        [0.2, 1.0, 0.3, 0.7],
        [0.5, 0.3, 1.0, 0.4],
        [0.1, 0.7, 0.4, 1.0]
      ],
      labels: ['Variable A', 'Variable B', 'Variable C', 'Variable D']
    }
  };
  
  return {
    id: visualizationId,
    visualType: type,
    dataColumns: ['column_1', 'column_2', 'column_3'].slice(0, Math.floor(Math.random() * 3) + 1),
    chartData: mockChartData[type],
    chartOptions: {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Visualization`,
      color: type === 'bar' ? '#4f46e5' : 
             type === 'line' ? '#0ea5e9' : 
             type === 'scatter' ? '#8b5cf6' : 
             type === 'pie' ? '#f59e0b' : 
             type === 'box' ? '#10b981' : '#ef4444',
      showLegend: true,
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis'
    },
    imageUrl: `#mock-chart-image-${type}.png`
  };
};

/**
 * Generate a chart based on visualization parameters
 * @param {string} visualizationId ID of the visualization to generate
 * @returns {Promise<string>} URL of the generated chart image
 */
const generateChart = async (visualizationId) => {
  // In a real implementation, this would generate a chart server-side
  // For now, we'll return a mock URL
  return `#mock-chart-image-${visualizationId}.png`;
};

export default {
  getAvailableChartTypes,
  getSuitableVisualizationsForAnalysis,
  createVisualization,
  getVisualization,
  generateChart
};