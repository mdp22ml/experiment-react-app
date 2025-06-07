import api from './api';

/**
 * Service for handling experiment-related operations
 */
export const experimentService = {
  /**
   * Create a new experiment
   * @param {Object} experimentData - The experiment data from the form
   * @returns {Promise<Object>} - The created experiment with results
   */
  async createExperiment(experimentData) {
    try {
      // In a real app, we would upload files first, then create the experiment
      // For demo purposes, we'll simulate this with the mock API

      // Extract file metadata (name, size) since we can't send actual File objects to the mock API
      const filesMeta = experimentData.files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));

      // Create the experiment with the extracted file metadata
      const response = await api.post('experiments', {
        ...experimentData,
        files: filesMeta
      });

      return response;
    } catch (error) {
      console.error('Error creating experiment:', error);
      throw new Error(error.message || 'Failed to create experiment');
    }
  },

  /**
   * Get an experiment by ID
   * @param {string} experimentId - The experiment ID
   * @returns {Promise<Object>} - The experiment data with results
   */
  async getExperiment(experimentId) {
    try {
      const response = await api.get(`experiments/${experimentId}`);
      return response;
    } catch (error) {
      console.error('Error getting experiment:', error);
      throw new Error(error.message || 'Failed to get experiment');
    }
  },

  /**
   * Get all experiments
   * @returns {Promise<Array>} - List of experiments
   */
  async getExperiments() {
    try {
      const response = await api.get('experiments');
      return response;
    } catch (error) {
      console.error('Error getting experiments:', error);
      throw new Error(error.message || 'Failed to get experiments');
    }
  }
};

// Export individual functions for ease of use
export const { createExperiment, getExperiment, getExperiments } = experimentService;

export default experimentService;