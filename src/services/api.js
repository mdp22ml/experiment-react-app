// Mock API client for ExperimentAI
const API_DELAY = 1000; // Simulate network delay

/**
 * Base API client for making requests to the backend
 */
const api = {
  /**
   * Simulates a GET request
   * @param {string} endpoint - The API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - The response data
   */
  async get(endpoint, params = {}) {
    console.log(`API GET: ${endpoint}`, params);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // This would be a real API call in production
    // return fetch(`/api/${endpoint}?${new URLSearchParams(params)}`).then(res => res.json());
    
    // For demo purposes, we'll simulate API responses
    switch (endpoint) {
      case 'experiments':
        return mockExperiments;
      case 'experiments/123':
        return mockExperiments[0];
      default:
        throw new Error(`Endpoint ${endpoint} not implemented in mock API`);
    }
  },
  
  /**
   * Simulates a POST request
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The request body
   * @returns {Promise<Object>} - The response data
   */
  async post(endpoint, data = {}) {
    console.log(`API POST: ${endpoint}`, data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY * 2));
    
    // This would be a real API call in production
    // return fetch(`/api/${endpoint}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(res => res.json());
    
    // For demo purposes, we'll simulate API responses
    switch (endpoint) {
      case 'experiments':
        return {
          id: '123',
          ...data,
          results: generateMockResults(data)
        };
      case 'export/notion':
        return { success: true, url: 'https://notion.so/experiment-123' };
      case 'share/slack':
        return { success: true, channel: 'experiments-channel' };
      default:
        throw new Error(`Endpoint ${endpoint} not implemented in mock API`);
    }
  }
};

// Mock data

/**
 * Generate mock experiment results based on experiment data
 * @param {Object} experimentData - The experiment data
 * @returns {Object} - The generated results
 */
const generateMockResults = (experimentData) => {
  return {
    textReport: `# Analysis Report for "${experimentData.title}"\n\n` +
      `## Summary\n\n` +
      `This report summarizes the findings from the ${experimentData.title} experiment. ` +
      `${experimentData.purpose ? `The purpose of this experiment was ${experimentData.purpose}.` : ''}\n\n` +
      `## Methods\n\n` +
      `The analysis employed the following methods:\n` +
      experimentData.analysisTypes.map(type => `- ${type}`).join('\n') + '\n\n' +
      `## Results\n\n` +
      `The results indicate significant findings in multiple areas. ` +
      `The data shows clear patterns that are visualized in the accompanying charts. ` +
      `Statistical analysis reveals p < 0.05 for all primary hypotheses, indicating statistical significance.\n\n` +
      `## Conclusion\n\n` +
      `The experiment successfully demonstrated the hypothesized outcomes with strong statistical support. ` +
      `Further research is recommended to explore additional variables and conditions.`,
    visualizationLinks: [
      '/visualizations/chart1.png',
      '/visualizations/chart2.png',
      '/visualizations/chart3.png'
    ],
    documentLinks: {
      pdf: '#',
      ...(experimentData.outputFormat.includes('word') ? { word: '#' } : {}),
      ...(experimentData.outputFormat.includes('ppt') ? { ppt: '#' } : {}),
      ...(experimentData.outputFormat.includes('notion') ? { notion: '#' } : {})
    },
    rawData: JSON.stringify({
      dataPoints: 1240,
      variables: 8,
      correlations: {
        var1_var2: 0.78,
        var1_var3: -0.23,
        var2_var3: 0.12
      },
      significance: {
        test1: { pValue: 0.012, significant: true },
        test2: { pValue: 0.045, significant: true },
        test3: { pValue: 0.067, significant: false }
      }
    }, null, 2)
  };
};

const mockExperiments = [
  {
    id: '123',
    title: 'Effect of Temperature on Reaction Rate',
    purpose: 'To determine how temperature affects chemical reaction rates',
    designRationale: 'Testing multiple temperature ranges provides broader insights',
    files: [
      { name: 'temperature_data.csv', size: 24500 },
      { name: 'reaction_observations.txt', size: 18200 }
    ],
    analysisTypes: ['descriptiveStats', 'regression'],
    visualizationTypes: ['lineChart', 'scatterPlot'],
    outputFormat: ['pdf', 'ppt'],
    status: 'completed',
    results: generateMockResults({
      title: 'Effect of Temperature on Reaction Rate',
      analysisTypes: ['descriptiveStats', 'regression'],
      visualizationTypes: ['lineChart', 'scatterPlot'],
      outputFormat: ['pdf', 'ppt']
    })
  }
];

export default api;