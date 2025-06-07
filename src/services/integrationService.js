import api from './api';

/**
 * Service for handling integration with external platforms
 */
export const integrationService = {
  /**
   * Export experiment to Notion
   * @param {Object} experiment - The experiment data
   * @returns {Promise<Object>} - The export result
   */
  async exportToNotion(experiment) {
    try {
      // Extract only the necessary data to send to Notion
      const notionData = {
        experimentId: experiment.id,
        title: experiment.title,
        results: experiment.results,
        analysisTypes: experiment.analysisTypes
      };
      
      const response = await api.post('export/notion', notionData);
      return response;
    } catch (error) {
      console.error('Error exporting to Notion:', error);
      throw new Error(error.message || 'Failed to export to Notion');
    }
  },
  
  /**
   * Send experiment to Slack
   * @param {Object} experiment - The experiment data
   * @returns {Promise<Object>} - The sharing result
   */
  async sendToSlack(experiment) {
    try {
      // Extract only the necessary data to send to Slack
      const slackData = {
        experimentId: experiment.id,
        title: experiment.title,
        summary: experiment.results?.textReport?.split('\n\n')[0] || 'No summary available',
        visualizations: experiment.results?.visualizationLinks || []
      };
      
      const response = await api.post('share/slack', slackData);
      return response;
    } catch (error) {
      console.error('Error sending to Slack:', error);
      throw new Error(error.message || 'Failed to send to Slack');
    }
  }
};

// Export individual functions for ease of use
export const { exportToNotion, sendToSlack } = integrationService;

export default integrationService;