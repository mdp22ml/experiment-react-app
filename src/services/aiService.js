/**
 * aiService.js
 * Service for handling AI-powered data interpretation via backend OpenAI API
 */

/**
 * Create a new AI interpretation request for analysis results
 * @param {Object} params - { analysisId, analysisType, query }
 * @returns {Promise<Object>} interpretation job info
 */
const createInterpretation = async (params) => {
  const interpretationId = `${params.analysisType}-${Date.now()}`;
  return {
    interpretationId,
    status: 'processing',
    params,
  };
};

/**
 * Get the AI interpretation result from your API route
 * @param {string} interpretationId - unique ID
 * @returns {Promise<Object>} interpretation result with insights
 */
const getInterpretation = async (interpretationId) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `Interpret the results of analysis ${interpretationId}. Provide statistical insights and practical suggestions.`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch AI interpretation');
  }

  const { result } = await response.json();

  return {
    answer: result,
    insights: result.split('\n').filter(Boolean), // basic splitting for UI
    suggestions: [],
  };
};

/**
 * Generate natural language insights from raw analysis results (optional extension)
 * @param {Object} analysisResult
 * @returns {Promise<Array<string>>}
 */
const generateDataInsights = async (analysisResult) => {
  if (!analysisResult) return [];

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `Explain the following analysis results in plain language:\n${JSON.stringify(analysisResult, null, 2)}`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch AI insights');
  }

  const { result } = await response.json();
  return result.split('\n').filter(Boolean);
};

/**
 * Natural language summary of an experiment (optional extension)
 */
const generateAnalysis = async (experiment, data) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `Analyze the experiment titled "${experiment?.title}" using the following data:\n${JSON.stringify(data, null, 2)}`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate experiment analysis');
  }

  const { result } = await response.json();
  return {
    analysisText: result,
    confidenceScore: null,
    suggestedNextSteps: [],
  };
};

export default {
  createInterpretation,
  getInterpretation,
  generateDataInsights,
  generateAnalysis,
};
