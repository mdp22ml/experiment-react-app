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
    try {
      // Validate input
      validateExperimentData(experimentData);
      
      const today = new Date().toLocaleDateString();
      console.log('Generating protocol for experiment:', experimentData.title);
      
      // Try AI generation first
      try {
        const detailedProtocol = await generateOpenAIProtocol(experimentData);
        
        if (detailedProtocol && detailedProtocol.trim()) {
          console.log('Successfully generated AI protocol');
          return parseAIResponse(detailedProtocol, experimentData.title, today);
        }
      } catch (aiError) {
        console.warn('AI generation failed, falling back to default:', aiError.message);
      }
      
      // Fallback to default protocol
      console.log('Using default protocol generation');
      const protocol = generateDefaultProtocol(experimentData, today);
      
      // Enhance with analysis types if available
      if (experimentData.analysisTypes?.length > 0) {
        const analysisSection = protocol.sections.find(s => s.id === 'data_analysis');
        if (analysisSection) {
          analysisSection.content = generateDataAnalysisContent(experimentData);
        }
      }
      
      return protocol;
    } catch (error) {
      console.error('Protocol generation failed:', error);
      throw new Error(`Failed to generate protocol: ${error.message}`);
    }
  },
  
  // Synchronous version for non-async contexts
  generateProtocolSync: (experimentData) => {
    try {
      validateExperimentData(experimentData);
      const today = new Date().toLocaleDateString();
      return generateDefaultProtocol(experimentData, today);
    } catch (error) {
      console.error('Sync protocol generation failed:', error);
      throw error;
    }
  },
  
  /**
   * Download protocol as a PDF file
   * @param {Object} protocol - The protocol to download
   * @param {String} format - The format to download (pdf, docx, etc.)
   * @returns {Promise<string>} Download URL or success message
   */
  downloadProtocol: async (protocol, format = 'pdf') => {
    try {
      console.log(`Downloading protocol in ${format} format`, protocol);
      
      // Validate protocol object
      if (!protocol || !protocol.id) {
        throw new Error('Invalid protocol object for download');
      }
      
      // Here you would implement actual download logic
      // For now, returning a success message
      return `Protocol "${protocol.title}" prepared for download in ${format.toUpperCase()} format`;
    } catch (error) {
      console.error('Error downloading protocol:', error);
      throw new Error(`Failed to download protocol: ${error.message}`);
    }
  },

  /**
   * Format protocol for different output formats (PDF, DOCX, etc.)
   * @param {Object} protocol - The protocol object to format
   * @param {String} format - The desired output format
   * @returns {Promise} A promise that resolves with the formatted protocol
   */
  formatProtocol: async (protocol, format = 'pdf') => {
    return new Promise((resolve, reject) => {
      try {
        if (!protocol || !protocol.id) {
          reject(new Error('Invalid protocol object'));
          return;
        }
        
        setTimeout(() => {
          resolve({
            protocol,
            format,
            url: `#${protocol.id}-${format}`,
            timestamp: new Date().toISOString()
          });
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Generate a template for data collection
   * @param {Object} protocol - Protocol object to generate template from
   * @returns {Object} Data collection template
   */
  generateDataTemplate: (protocol) => {
    try {
      const sections = protocol?.sections || [];
      const methodsSection = sections.find(section => section.id === 'methods') || {};
      
      return {
        id: `template-${Date.now()}`,
        title: `Data Collection Template for ${protocol?.title || 'Unknown Protocol'}`,
        columns: [
          { id: 'sample_id', name: 'Sample ID', type: 'text', required: true },
          { id: 'date', name: 'Date', type: 'date', required: true },
          { id: 'time', name: 'Time', type: 'time', required: true },
          { id: 'measurement', name: 'Measurement', type: 'number', required: true },
          { id: 'condition', name: 'Condition', type: 'text', required: false },
          { id: 'notes', name: 'Notes', type: 'text', required: false }
        ],
        rows: 10,
        created: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating data template:', error);
      throw new Error(`Failed to generate data template: ${error.message}`);
    }
  }
};

// Helper functions for protocol content generation

/**
 * Validate experiment data input
 * @param {Object} experimentData - The experiment data to validate
 * @throws {Error} If validation fails
 */
function validateExperimentData(experimentData) {
  if (!experimentData || typeof experimentData !== 'object') {
    throw new Error('Invalid experiment data provided - must be an object');
  }
  
  if (!experimentData.title || typeof experimentData.title !== 'string' || !experimentData.title.trim()) {
    throw new Error('Experiment title is required and must be a non-empty string');
  }
  
  // Optional: validate other fields if they exist
  if (experimentData.analysisTypes && !Array.isArray(experimentData.analysisTypes)) {
    throw new Error('Analysis types must be an array');
  }
  
  return true;
}

/**
 * Generate protocol using OpenAI
 * @param {Object} experimentData - Experiment data
 * @returns {String} AI-generated protocol content
 */
async function generateOpenAIProtocol(experimentData) {
  const prompt = `Generate a detailed experimental protocol for the following experiment:

Experiment Title: ${experimentData.title || 'Untitled Experiment'}
Purpose: ${experimentData.purpose || 'Not specified'}
Design Rationale: ${experimentData.designRationale || 'Not specified'}
Analysis Types: ${(experimentData.analysisTypes || []).join(', ') || 'Not specified'}

Please provide a comprehensive protocol with the following sections:

1. 🔬 Materials and Equipment - detailed list of all materials and equipment with specific quantities
2. 📋 Step-by-Step Procedure - numbered steps with precise actions, timing, temperatures, concentrations, etc.
3. 🧪 Data Analysis - detailed steps for analyzing the collected data
4. ⚠️ Safety and Important Tips - safety precautions and critical considerations

Make sure to include SPECIFIC quantities, concentrations, temperatures, and timing for all steps.
Format the response with clear section headers and detailed content.`;

  try {
    console.log('Sending protocol prompt to /api/analyze...');
    
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        query: prompt,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI API failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    
    if (!data.result) {
      throw new Error('No result returned from OpenAI API');
    }

    return data.result;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

/**
 * Parse AI response into structured protocol sections
 * @param {String} aiResponse - Raw response from AI
 * @param {String} title - Protocol title
 * @param {String} date - Current date
 * @returns {Object} Structured protocol object
 */
function parseAIResponse(aiResponse, title, date) {
  if (!aiResponse || typeof aiResponse !== 'string') {
    throw new Error('Invalid AI response format');
  }

  const sections = [];
  
  // Try to parse sections using different header formats
  const lines = aiResponse.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  for (const line of lines) {
    // Check for various header formats
    const headerMatch = line.match(/^#+\s+(.+)$/) || // Markdown headers
                       line.match(/^\d+\.\s+(.+)$/) || // Numbered sections
                       line.match(/^[🔬📋🧪⚠️]\s+(.+)$/) || // Emoji headers
                       line.match(/^([A-Z][^:]+):?\s*$/) || // All caps headers
                       line.match(/^\*\*([^*]+)\*\*:?\s*$/); // Bold headers
    
    if (headerMatch) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          id: currentSection.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          title: currentSection,
          content: currentContent.join('\n').trim()
        });
      }
      
      // Start new section
      currentSection = headerMatch[1].trim();
      currentContent = [];
    } else if (currentSection && line.trim()) {
      // Add content to current section
      currentContent.push(line);
    } else if (!currentSection && line.trim()) {
      // Content before any headers - add to intro section
      if (!sections.find(s => s.id === 'introduction')) {
        sections.push({
          id: 'introduction',
          title: 'Introduction',
          content: line.trim()
        });
      } else {
        const introSection = sections.find(s => s.id === 'introduction');
        introSection.content += '\n' + line.trim();
      }
    }
  }
  
  // Add final section
  if (currentSection) {
    sections.push({
      id: currentSection.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      title: currentSection,
      content: currentContent.join('\n').trim()
    });
  }
  
  // Fallback: treat entire response as single section if no sections found
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
    aiGenerated: true,
    created: new Date().toISOString()
  };
}

/**
 * Generate a default protocol when AI generation fails
 * @param {Object} experimentData - The experiment data
 * @param {String} date - Current date
 * @returns {Object} The generated protocol object
 */
function generateDefaultProtocol(experimentData, date) {
  return {
    id: `protocol-${Date.now()}`,
    title: experimentData.title || 'Untitled Protocol',
    date: date,
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        content: `**Purpose:** ${experimentData.purpose || 'Not specified'}\n\n**Design Rationale:** ${experimentData.designRationale || 'Not specified'}\n\n**Analysis Types:** ${(experimentData.analysisTypes || []).join(', ') || 'Not specified'}`
      },
      {
        id: 'materials',
        title: 'Materials and Equipment',
        content: generateMaterialsList(experimentData)
      },
      {
        id: 'methods',
        title: 'Methods',
        content: generateMethodsContent(experimentData)
      },
      {
        id: 'data_analysis',
        title: 'Data Analysis',
        content: generateDataAnalysisContent(experimentData)
      },
      {
        id: 'safety',
        title: 'Safety Considerations',
        content: '- Follow standard laboratory safety protocols\n- Use appropriate personal protective equipment (PPE)\n- Ensure proper ventilation in the work area\n- Handle all chemicals according to their safety data sheets\n- Have emergency procedures readily available\n- Dispose of waste materials according to institutional guidelines'
      }
    ],
    aiGenerated: false,
    created: new Date().toISOString()
  };
}

/**
 * Generate materials list content based on experiment data
 * @param {Object} experimentData - Experiment data
 * @returns {String} Formatted materials list
 */
function generateMaterialsList(experimentData) {
  const baseMaterials = [
    '- Laboratory notebook for recording observations',
    '- Appropriate measuring instruments (scale, pipettes, etc.)',
    '- Sample containers and labeling materials',
    '- Personal protective equipment (gloves, safety glasses, lab coat)',
    '- Timer or stopwatch for timing procedures'
  ];
  
  // Add specific materials based on experiment type
  const additionalMaterials = [];
  
  if (experimentData.analysisTypes?.includes('statistical')) {
    additionalMaterials.push('- Statistical software or calculator');
  }
  
  if (experimentData.analysisTypes?.includes('chemical')) {
    additionalMaterials.push('- Chemical reagents as specified in methods');
    additionalMaterials.push('- pH strips or pH meter');
    additionalMaterials.push('- Fume hood access');
  }
  
  if (experimentData.analysisTypes?.includes('biological')) {
    additionalMaterials.push('- Sterile techniques equipment');
    additionalMaterials.push('- Incubator or controlled environment chamber');
    additionalMaterials.push('- Microscope for observations');
  }
  
  const allMaterials = [...baseMaterials, ...additionalMaterials];
  
  return `## Required Materials and Equipment\n\n${allMaterials.join('\n')}\n\n**Note:** Specific quantities and concentrations will depend on the scale of your experiment. Adjust accordingly based on your experimental design.`;
}

/**
 * Generate methods content based on experiment data
 * @param {Object} experimentData - Experiment data
 * @returns {String} Formatted methods content
 */
function generateMethodsContent(experimentData) {
  const basicSteps = [
    '1. **Preparation Phase**\n   - Set up your workspace and gather all required materials\n   - Ensure all equipment is clean and calibrated\n   - Review safety protocols and emergency procedures',
    
    '2. **Sample Preparation**\n   - Prepare samples according to experimental design\n   - Label all samples clearly with unique identifiers\n   - Record initial conditions and measurements',
    
    '3. **Experimental Procedure**\n   - Follow the specific steps outlined in your experimental design\n   - Maintain consistent conditions throughout the experiment\n   - Record all observations and measurements in real-time',
    
    '4. **Data Collection**\n   - Collect data at predetermined time intervals\n   - Use appropriate measuring tools and techniques\n   - Double-check all measurements for accuracy',
    
    '5. **Quality Control**\n   - Run control samples alongside experimental samples\n   - Verify that equipment is functioning properly\n   - Document any deviations from the planned procedure'
  ];
  
  // Add specific steps based on analysis types
  if (experimentData.analysisTypes?.includes('statistical')) {
    basicSteps.push('6. **Statistical Considerations**\n   - Ensure adequate sample size for statistical power\n   - Randomize sample order to minimize bias\n   - Plan for appropriate statistical tests');
  }
  
  return `## Step-by-Step Procedure\n\n${basicSteps.join('\n\n')}\n\n**Important:** Always follow your institution's specific protocols and safety guidelines. Adjust timing and procedures based on your specific experimental requirements.`;
}

/**
 * Generate data analysis content based on experiment data
 * @param {Object} experimentData - Experiment data
 * @returns {String} Formatted data analysis content
 */
function generateDataAnalysisContent(experimentData) {
  const analysisTypes = experimentData.analysisTypes || [];
  let content = '## Data Analysis Plan\n\n';
  
  // Basic analysis steps
  content += '### Data Preparation\n';
  content += '1. **Data Cleaning**\n   - Review all collected data for completeness\n   - Identify and handle any outliers or missing values\n   - Verify data entry accuracy\n\n';
  
  content += '2. **Data Organization**\n   - Structure data in appropriate format (spreadsheet, database, etc.)\n   - Create backup copies of raw data\n   - Document any data transformations\n\n';
  
  // Specific analysis based on types
  if (analysisTypes.includes('statistical')) {
    content += '### Statistical Analysis\n';
    content += '1. **Descriptive Statistics**\n   - Calculate means, medians, and standard deviations\n   - Create frequency distributions\n   - Generate summary tables\n\n';
    
    content += '2. **Inferential Statistics**\n   - Choose appropriate statistical tests\n   - Check assumptions (normality, homogeneity of variance)\n   - Perform hypothesis testing\n   - Calculate confidence intervals\n\n';
  }
  
  if (analysisTypes.includes('descriptive')) {
    content += '### Descriptive Analysis\n';
    content += '1. **Visual Analysis**\n   - Create appropriate graphs and charts\n   - Generate histograms and box plots\n   - Look for patterns and trends\n\n';
    
    content += '2. **Summary Analysis**\n   - Summarize key findings\n   - Identify notable observations\n   - Document unexpected results\n\n';
  }
  
  // Default analysis if no specific types
  if (analysisTypes.length === 0) {
    content += '### General Analysis\n';
    content += '1. **Organize and review all collected data\n';
    content += '2. **Calculate basic statistics (means, ranges, etc.)\n';
    content += '3. **Create visualizations to identify patterns\n';
    content += '4. **Compare results to expected outcomes\n';
    content += '5. **Document findings and observations\n\n';
  }
  
  content += '### Reporting\n';
  content += '1. **Results Summary**\n   - Compile key findings\n   - Create tables and figures\n   - Write clear, concise descriptions\n\n';
  
  content += '2. **Interpretation**\n   - Discuss results in context of research question\n   - Compare with existing literature or expectations\n   - Identify limitations and potential sources of error\n\n';
  
  return content;
}

// Test function to verify the service works
async function testProtocolGeneration() {
  const testData = {
    title: "Test Experiment: pH Effects on Plant Growth",
    purpose: "Testing how different pH levels affect plant growth rates",
    designRationale: "pH is a critical factor in nutrient uptake for plants",
    analysisTypes: ["statistical", "descriptive"]
  };
  
  try {
    console.log('Testing protocol generation...');
    const protocol = await protocolService.generateProtocol(testData);
    console.log('Protocol generated successfully:', protocol);
    return protocol;
  } catch (error) {
    console.error('Test failed:', error);
    return null;
  }
}

// Export the service
export default protocolService;

// Also export the test function for debugging
export { testProtocolGeneration };
