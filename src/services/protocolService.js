/**
 * Protocol Service
 * Handles all protocol-related operations like generation and formatting
 */
const protocolService = {
  /**
   * Generate a protocol based on experiment data using OpenAI
   * @param {Object} experimentData - The experiment data to generate protocol from
   * @returns {Object} The generated protocol object
   */
  generateProtocol: async (experimentData) => {
    const today = new Date().toLocaleDateString();
    console.log('Generating protocol for experiment:', experimentData.title);
    
    try {
      // Call OpenAI API to generate detailed protocol
      const detailedProtocol = await generateOpenAIProtocol(experimentData);
      
      if (detailedProtocol) {
        // Parse the OpenAI response into our protocol structure
        return parseAIResponse(detailedProtocol, experimentData.title, today);
      }
    } catch (error) {
      console.error('Error generating protocol with OpenAI:', error);
      // Fallback to default protocol if OpenAI generation fails
    }
    
    // Generate fallback protocol using local function
    const protocol = generateDefaultProtocol(experimentData, today);
    
    // Add specific protocol elements based on experiment details
    if (experimentData.analysisTypes?.length > 0) {
      // Add more detailed analysis section based on selected types
      const analysisSection = protocol.sections.find(s => s.id === 'data_analysis');
      if (analysisSection) {
        analysisSection.content = generateDataAnalysisContent(experimentData);
      }
    }
    
    return protocol;
  },
  
  // Synchronous version for non-async contexts
  generateProtocolSync: (experimentData) => {
    const today = new Date().toLocaleDateString();
    return generateDefaultProtocol(experimentData, today);
  },
  
  /**
   * Download protocol as a PDF file
   * @param {Object} protocol - The protocol to download
   * @returns {Promise<string>} Download URL or success message
   */
  downloadProtocol: async (protocol, format = 'pdf') => {
    try {
      console.log(`Downloading protocol in ${format} format`, protocol);
      return `Protocol prepared for download in ${format.toUpperCase()} format`;
    } catch (error) {
      console.error('Error downloading protocol:', error);
      throw new Error('Failed to download protocol');
    }
  },

  /**
   * Format protocol for different output formats (PDF, DOCX, etc.)
   * @param {Object} protocol - The protocol object to format
   * @param {String} format - The desired output format
   * @returns {Promise} A promise that resolves with the formatted protocol
   */
  formatProtocol: async (protocol, format = 'pdf') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          protocol,
          format,
          url: `#${protocol.id}-${format}`
        });
      }, 1000);
    });
  },
  
  /**
   * Generate a template for data collection
   * @param {Object} protocol - Protocol object to generate template from
   * @returns {Object} Data collection template
   */
  generateDataTemplate: (protocol) => {
    const sections = protocol.sections || [];
    const methodsSection = sections.find(section => section.id === 'methods') || {};
    
    return {
      id: `template-${Date.now()}`,
      title: `Data Collection Template for ${protocol.title}`,
      columns: [
        { id: 'sample_id', name: 'Sample ID', type: 'text' },
        { id: 'date', name: 'Date', type: 'date' },
        { id: 'time', name: 'Time', type: 'time' },
        { id: 'measurement', name: 'Measurement', type: 'number' },
        { id: 'notes', name: 'Notes', type: 'text' }
      ],
      rows: 10
    };
  }
};

// Helper functions for protocol content generation

/**
 * Generate protocol using OpenAI
 * @param {Object} experimentData - Experiment data
 * @returns {String} AI-generated protocol content
 */
async function generateOpenAIProtocol(experimentData) {
  // build the detailed prompt
  const prompt = `Generate a detailed experimental protocol for the following experiment:

Experiment Title: ${experimentData.title || 'Untitled Experiment'}

Purpose: ${experimentData.purpose || 'Not specified'}

Design Rationale: ${experimentData.designRationale || 'Not specified'}

Analysis Types: ${(experimentData.analysisTypes || []).join(', ') || 'Not specified'}

---

Please provide a comprehensive protocol with the following sections:

1. 🔬 What you'll need - detailed list of all materials and equipment with specific quantities
2. 📋 Step-by-Step Procedure - numbered steps with precise actions, timing, temperatures, concentrations, etc.
3. 🧪 Data Analysis - detailed steps for analyzing the collected data
4. ⚠️ Important Tips - safety precautions and critical considerations

Make sure to include SPECIFIC quantities, concentrations, temperatures, and timing for all steps.`;

  console.log('Sending protocol prompt to /api/analyze…');

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: prompt })
  });

  if (!res.ok) {
    throw new Error(`OpenAI request failed: ${res.status}`);
  }

  const { result } = await res.json();
  return result;
}

/**
 * Generate a mock detailed protocol (simulating OpenAI response)
 * @param {Object} experimentData - Experiment data
 * @returns {String} Detailed protocol content
 */
function generateMockDetailedProtocol(experimentData) {
  // ... your existing mock logic unchanged ...
  return /* mock text */;
}

/**
 * Parse AI response into structured protocol sections
 * @param {String} aiResponse - Raw response from AI
 * @param {String} title - Protocol title
 * @param {String} date - Current date
 * @returns {Object} Structured protocol object
 */
function parseAIResponse(aiResponse, title, date) {
  const sections = [];
  const parts = aiResponse.split(/^#+\s+/m);
  parts.forEach((part, index) => {
    if (part.trim()) {
      const lines = part.trim().split('\n');
      const sectionTitle = lines[0].trim();
      const sectionContent = lines.slice(1).join('\n').trim();
      const sectionId = sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      sections.push({
        id: sectionId || `section_${index}`,
        title: sectionTitle || `Section ${index + 1}`,
        content: sectionContent
      });
    }
  });
  if (sections.length === 0) {
    sections.push({
      id: 'protocol_content',
      title: 'Protocol Content',
      content: aiResponse.trim()
    });
  }
  return {
    id: `protocol-${Date.now()}`,
    title: title || 'Untitled Protocol',
    date: date,
    sections,
    aiGenerated: true
  };
}

/**
 * Generate a default protocol when AI generation fails
 * @param {Object} experimentData - The experiment data
 * @param {String} date - Current date
 * @returns {Object} The generated protocol object
 */
function generateDefaultProtocol(experimentData, date) {
  // ... your existing default protocol logic unchanged ...
  return /* default protocol object */;
}

/**
 * Generate design rationale content
 * @param {String} rationale - Original design rationale from experiment
 * @returns {String} Formatted design rationale
 */
function generateDesignRationale(rationale) {
  if (!rationale) return '';
  return `## Design Rationale\n\n${rationale}`;
}

/**
 * Generate materials list content based on experiment data
 * @param {Object} experimentData - Experiment data
 * @returns {String} Formatted materials list
 */
function generateMaterialsList(experimentData) {
  // ... unchanged ...
  return /* materials list text */;
}

/**
 * Generate methods content based on experiment data
 * @param {Object} experimentData - Experiment data
 * @returns {String} Formatted methods content
 */
function generateMethodsContent(experimentData) {
  // ... unchanged ...
  return /* methods text */;
}

/**
 * Generate data analysis content based on experiment data
 * @param {Object} experimentData - Experiment data
 * @returns {String} Formatted data analysis content
 */
function generateDataAnalysisContent(experimentData) {
  // ... unchanged ...
  return /* data analysis text */;
}

export default protocolService;
