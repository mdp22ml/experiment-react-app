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
      // This is a placeholder function - in a real implementation,
      // we would call a service to convert the protocol to PDF and download it
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
    // This is a placeholder function for future implementation
    // In a real app, this would convert the protocol to the specified format
    
    return new Promise((resolve) => {
      // Mock implementation
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
    // Extract relevant information from protocol to create a data template
    const sections = protocol.sections || [];
    const methodsSection = sections.find(section => section.id === 'methods') || {};
    
    // This would generate appropriate columns based on the protocol methods
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
  try {
    // Create a detailed prompt for OpenAI based on experiment data
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

Format the protocol similar to this example:

🌈 [Title] Assay Protocol

🔬 What you'll need:
- Item 1 (with exact quantity)
- Item 2 (with exact quantity)

📋 Step-by-Step:
1️⃣ First step (with exact quantities, timings, and temperatures)
2️⃣ Second step (with exact quantities, timings, and temperatures)

🧪 Data Analysis:
- Specific calculations and formulas
- Statistical approaches

⚠️ Important Tips:
- Safety precaution 1
- Critical consideration 1

Make sure to include SPECIFIC quantities, concentrations, temperatures, and timing for all steps.`;

    // In a real implementation, this would call the OpenAI API
    // For this demo, we're using a mock implementation that returns a sample protocol
    console.log('Sending request to OpenAI with prompt:', prompt.substring(0, 100) + '...');
    
    // Mock OpenAI API call with a delay
    const response = await new Promise(resolve => {
      setTimeout(() => {
        // This would be the response from OpenAI in a real implementation
        const mockResponse = generateMockDetailedProtocol(experimentData);
        resolve(mockResponse);
      }, 2000);
    });
    
    return response;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

/**
 * Generate a mock detailed protocol (simulating OpenAI response)
 * @param {Object} experimentData - Experiment data
 * @returns {String} Detailed protocol content
 */
function generateMockDetailedProtocol(experimentData) {
  // Extract experiment details
  const title = experimentData.title || 'Untitled Experiment';
  const purpose = experimentData.purpose || '';
  const analysisTypes = experimentData.analysisTypes || [];
  
  // Create a mockup protocol based on experiment purpose and analysis types
  let protocolTitle, materials, steps, dataAnalysis, tips;
  
  // Determine protocol type based on experiment purpose
  if (purpose.toLowerCase().includes('cell')) {
    protocolTitle = `🌈 Cell Viability ${title} Assay Protocol`;
    
    materials = `- Alamar Blue reagent (resazurin sodium salt solution) - 10 mL stock solution at 0.15 mg/mL
- Complete cell culture medium (DMEM with 10% FBS) - 100 mL
- 96-well tissue culture treated plate - 1 plate
- Sterile reservoirs for multichannel pipetting - 2-3 reservoirs
- Multichannel pipette (20-200 μL) and sterile tips
- Cell culture of interest at 70-80% confluency
- PBS (sterile, pH 7.4) - 50 mL
- Trypsin-EDTA (0.25%) - 5 mL
- Fluorescence or absorbance plate reader
- Hemocytometer or automated cell counter
- 15 mL conical tubes - 3-5 tubes
- 37°C, 5% CO₂ cell culture incubator`;
    
    steps = `1️⃣ Seed your cells
- Wash cells with 5 mL PBS and detach with 1 mL trypsin-EDTA (0.25%) for 3-5 minutes at 37°C
- Neutralize trypsin with 9 mL complete medium and count cells
- Adjust cell suspension to 5×10⁴ cells/mL in complete medium
- Add 100 μL cell suspension per well (5×10³ cells/well) in a 96-well plate
- Include cell-free control wells with medium only
- Allow cells to adhere overnight (16-24 hours) at 37°C, 5% CO₂

2️⃣ Add test compounds (if applicable)
- Dilute test compounds to 2X final concentration in complete medium
- Remove 50 μL medium from each well
- Add 50 μL of 2X test compound dilutions to appropriate wells
- Include untreated control wells (add 50 μL fresh medium instead)
- Incubate for desired treatment time (24, 48, or 72 hours) at 37°C, 5% CO₂

3️⃣ Add Alamar Blue reagent
- Prepare working solution: 1 part Alamar Blue stock to 9 parts complete medium
- Remove 100 μL medium from each well
- Add 100 μL Alamar Blue working solution to each well (final concentration: 10% v/v)
- Include reagent control wells (100 μL Alamar Blue solution in cell-free wells)

4️⃣ Incubate
- Incubate plate at 37°C in the dark (wrap in aluminum foil) for 2-4 hours
- Check color change periodically - solution turns from blue to pink as cells reduce resazurin
- Optimal incubation time depends on cell type and density

5️⃣ Read the fluorescence or absorbance
- For fluorescence measurement:
  * Excitation wavelength: 560 nm (±10 nm)
  * Emission wavelength: 590 nm (±10 nm)
- For absorbance measurement:
  * Measure at 570 nm and 600 nm
  * Calculate reduction using formula: (εOX)λ2 × A λ1 - (εOX)λ1 × A λ2) / ((εRED)λ1 × A'λ2 - (εRED)λ2 × A'λ1)
  * Where ε = molar extinction coefficient, A = absorbance of test wells, A' = absorbance of negative control`;
    
    dataAnalysis = `- Calculate % cell viability for each treatment condition:
  % Viability = (Fluorescence of treated cells / Fluorescence of untreated control) × 100

- Subtract background signal from reagent control wells from all readings
- For dose-response curves, plot % viability vs. log(concentration)
- Calculate IC50 values (concentration causing 50% inhibition) using appropriate curve-fitting software
- Perform statistical analysis: one-way ANOVA with Dunnett's post-hoc test to compare treatment groups to control
- For time-course studies, plot % viability vs. time for each concentration`;
    
    tips = `- Optimize cell seeding density for each cell type; too many or too few cells will yield inaccurate results
- Protect Alamar Blue from light as resazurin is light-sensitive
- Monitor color change; over-incubation can result in complete reduction and loss of signal dynamic range
- Test compounds may interfere with the assay; include appropriate controls
- For longer experiments, Alamar Blue can be removed, cells washed, and fresh medium added for continued culture
- Verify results with a complementary viability assay like ATP measurement or LDH release
- Alamar Blue is non-toxic, allowing for continuous monitoring of the same cell population
- Store Alamar Blue stock solution at 4°C protected from light for up to 6 months`;
  } 
  else if (purpose.toLowerCase().includes('pcr') || purpose.toLowerCase().includes('dna')) {
    protocolTitle = `🧬 ${title} PCR Protocol`;
    
    materials = `- DNA template (10-100 ng/μL) - 10 μL
- Forward primer (10 μM) - 20 μL
- Reverse primer (10 μM) - 20 μL
- dNTP mix (10 mM each) - 50 μL
- 5X PCR buffer - 200 μL
- DNA polymerase (e.g., Taq, Phusion) - 5 μL at 2 U/μL
- Nuclease-free water - 1 mL
- PCR tubes (0.2 mL) or 96-well PCR plate
- Thermal cycler
- Micropipettes and sterile filter tips
- Microcentrifuge
- Ice bucket with ice
- Mineral oil (if thermal cycler lacks heated lid)
- Agarose - 1 g
- 50X TAE buffer - 20 mL
- DNA loading dye - 100 μL
- DNA ladder - 20 μL
- Ethidium bromide or other DNA stain - 10 μL of 10 mg/mL stock
- Gel electrophoresis equipment`;
    
    steps = `1️⃣ Prepare PCR reaction mixture
- Thaw all reagents on ice except DNA polymerase (keep at -20°C until use)
- For each 25 μL reaction, add to a PCR tube on ice:
  * 5 μL 5X PCR buffer
  * 0.5 μL dNTP mix (10 mM each)
  * 1.25 μL forward primer (10 μM)
  * 1.25 μL reverse primer (10 μM)
  * 0.25 μL DNA polymerase (2 U/μL)
  * 1-5 μL template DNA (10-100 ng total)
  * Nuclease-free water to 25 μL total volume
- Prepare master mix for multiple reactions to reduce pipetting errors
- Mix gently by pipetting up and down or brief vortexing
- Centrifuge briefly (5 seconds) to collect contents at bottom of tube

2️⃣ Program the thermal cycler
- Initial denaturation: 95°C for 2 minutes
- 25-35 cycles of:
  * Denaturation: 95°C for 30 seconds
  * Annealing: 55-65°C (primer-dependent) for 30 seconds
  * Extension: 72°C for 30 seconds per kb of target
- Final extension: 72°C for 5 minutes
- Hold at 4°C

3️⃣ Run the PCR program
- Place tubes in thermal cycler and close lid firmly
- Start the PCR program
- Expected run time: 1.5-3 hours depending on cycle number and extension time

4️⃣ Analyze PCR products
- Prepare 1% agarose gel (1 g agarose in 100 mL 1X TAE buffer)
- Add DNA stain (e.g., 5 μL ethidium bromide per 100 mL gel)
- Mix 5 μL PCR product with 1 μL 6X loading dye
- Load samples and DNA ladder onto gel
- Run at 100V for 30-45 minutes
- Visualize bands using gel documentation system`;
    
    dataAnalysis = `- Confirm presence of specific PCR product at expected size by comparing to DNA ladder
- Estimate product concentration by comparing band intensity to ladder bands of known quantity
- For quantitative PCR (qPCR), analyze amplification curves and melting curves
- Calculate amplification efficiency using standard curve (for qPCR)
- Determine Cq (quantification cycle) values for unknown samples
- For multiple targets, normalize to reference genes using ΔΔCq method`;
    
    tips = `- Always include positive control (known template) and negative control (no template)
- Use thin-walled PCR tubes for optimal heat transfer
- Keep enzymes on ice at all times
- Avoid contamination: use filter tips and separate pre- and post-PCR areas
- Optimize annealing temperature for your specific primers (generally Tm - 5°C)
- For GC-rich templates, add 5-10% DMSO or use special GC buffers
- For long amplicons (>3 kb), use specialized long-range polymerases
- Troubleshooting no product: check template quality, increase cycle number, optimize annealing temperature
- Troubleshooting multiple bands: increase annealing temperature, redesign primers, reduce cycle number`;
  }
  else {
    protocolTitle = `🔍 ${title} Experimental Protocol`;
    
    materials = `- Laboratory notebook and pen
- Computer with data analysis software
- Appropriate sample materials for your experiment
- Measurement instruments specific to your analysis
- Calibration standards
- Sample preparation materials
- Statistical software package
- Data storage device
- Personal protective equipment (lab coat, gloves, safety glasses)`;
    
    if (analysisTypes.includes('descriptiveStats') || analysisTypes.includes('hypothesisTesting')) {
      materials += `\n- Statistical software (SPSS, R, or similar)
- Data collection sheets or electronic data collection system
- Reference standards for calibration
- Sample labeling materials`;
    }
    
    steps = `1️⃣ Prepare your experimental setup
- Gather all required materials and equipment
- Calibrate all measurement instruments according to manufacturer specifications
- Prepare data collection sheets or electronic data collection system
- Establish clear labeling system for all samples and measurements

2️⃣ Prepare samples
- Follow specific preparation procedures relevant to your experiment
- Prepare at least 3 biological replicates for each condition
- Include appropriate controls
- Label all samples clearly with sample ID, date, and condition

3️⃣ Perform measurements
- Measure samples in a randomized order to minimize bias
- Record all raw data in your laboratory notebook or electronic system
- Include exact time and environmental conditions for each measurement
- Perform technical replicates (minimum 3) for each biological sample

4️⃣ Process and analyze data
- Enter all data into your analysis software
- Perform quality control checks on raw data
- Apply appropriate statistical analyses based on your experimental design
- Generate visualizations to represent your findings`;
    
    dataAnalysis = `- Clean data: remove outliers based on statistical criteria (e.g., values > 3 standard deviations from mean)
- Calculate descriptive statistics (mean, median, standard deviation, etc.)
- Test assumptions for statistical analyses (normality, homogeneity of variance)
- Perform appropriate statistical tests based on experimental design:
  * For comparisons between two groups: t-test or non-parametric equivalent
  * For multiple groups: ANOVA with appropriate post-hoc tests
  * For relationships between variables: correlation and regression analysis`;
    
    // Add specific analysis sections based on selected analysis types
    if (analysisTypes.includes('descriptiveStats')) {
      dataAnalysis += `\n- Calculate central tendency (mean, median) and dispersion (standard deviation, range)
- Create box plots and histograms to visualize data distributions
- Report confidence intervals (95%) for all key measurements`;
    }
    
    if (analysisTypes.includes('hypothesisTesting')) {
      dataAnalysis += `\n- Define null and alternative hypotheses clearly
- Determine appropriate alpha level (typically 0.05)
- Calculate p-values and compare to alpha
- Report effect sizes to indicate practical significance`;
    }
    
    if (analysisTypes.includes('regression')) {
      dataAnalysis += `\n- Create scatter plots to visualize relationships
- Calculate correlation coefficients (Pearson's r or Spearman's rho)
- Fit regression models and check assumptions (linearity, homoscedasticity)
- Report R² values and regression equations`;
    }
    
    tips = `- Maintain comprehensive records of all procedures and observations
- Take photos of experimental setup for documentation
- Back up all data in multiple locations
- Blind analysis where possible to reduce experimenter bias
- Consult with statistical experts before beginning complex analyses
- Perform power analysis to ensure adequate sample sizes
- Consider pre-registering your experiment and analysis plan
- Report all results, including negative and inconclusive findings`;
  }
  
  // Combine all sections into a detailed protocol
  return `${protocolTitle}\n\n🔬 What you'll need:\n${materials}\n\n📋 Step-by-Step:\n${steps}\n\n🧪 Data Analysis:\n${dataAnalysis}\n\n⚠️ Important Tips:\n${tips}`;
}

/**
 * Parse AI response into structured protocol sections
 * @param {String} aiResponse - Raw response from AI
 * @param {String} title - Protocol title
 * @param {String} date - Current date
 * @returns {Object} Structured protocol object
 */
function parseAIResponse(aiResponse, title, date) {
  // Basic parsing of AI response into sections
  const sections = [];
  
  // Split text by markdown headers
  const parts = aiResponse.split(/^#+\s+/m);
  
  // Process each section
  parts.forEach((part, index) => {
    if (part.trim()) {
      // Get the section title and content
      const lines = part.trim().split('\n');
      const sectionTitle = lines[0].trim();
      const sectionContent = lines.slice(1).join('\n').trim();
      
      // Create unique ID from section title
      const sectionId = sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      
      sections.push({
        id: sectionId || `section_${index}`,
        title: sectionTitle || `Section ${index + 1}`,
        content: sectionContent
      });
    }
  });
  
  // If no sections were extracted (AI response didn't use headers),
  // create a single section with the whole content
  if (sections.length === 0) {
    sections.push({
      id: 'protocol_content',
      title: 'Protocol Content',
      content: aiResponse.trim()
    });
  }
  
  // Create the protocol object
  return {
    id: `protocol-${Date.now()}`,
    title: title || 'Untitled Protocol',
    date: date,
    sections: sections,
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
  // Generate protocol sections using helper functions
  const introduction = `# Introduction\n\nThis protocol outlines the experiment titled "${experimentData.title || 'Untitled Experiment'}" with the purpose of ${experimentData.purpose || 'conducting scientific research'}.`;
  
  const designRationale = generateDesignRationale(experimentData.designRationale);
  
  const materials = `# Materials and Equipment\n\n${generateMaterialsList(experimentData)}`;
  
  const methods = `# Methods\n\n${generateMethodsContent(experimentData)}`;
  
  const dataAnalysis = `# Data Collection and Analysis\n\n${generateDataAnalysisContent(experimentData)}`;
  
  const expectedResults = '# Expected Results\n\nOutline the anticipated outcomes of this experiment and how they relate to the experimental hypothesis or objectives.';
  
  const references = '# References\n\nList all relevant literature and sources used in developing this protocol.';
  
  // Create protocol object with sections
  return {
    id: `protocol-${Date.now()}`,
    title: experimentData.title || 'Untitled Protocol',
    date: date,
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: introduction.replace('# Introduction\n\n', '')
      },
      {
        id: 'design_rationale',
        title: 'Design Rationale',
        content: designRationale.replace('## Design Rationale\n\n', '')
      },
      {
        id: 'materials',
        title: 'Materials and Equipment',
        content: materials.replace('# Materials and Equipment\n\n', '')
      },
      {
        id: 'methods',
        title: 'Methods',
        content: methods.replace('# Methods\n\n', '')
      },
      {
        id: 'data_analysis',
        title: 'Data Collection and Analysis',
        content: dataAnalysis.replace('# Data Collection and Analysis\n\n', '')
      },
      {
        id: 'expected_results',
        title: 'Expected Results',
        content: expectedResults.replace('# Expected Results\n\n', '')
      },
      {
        id: 'references',
        title: 'References',
        content: references.replace('# References\n\n', '')
      }
    ],
    aiGenerated: false
  };
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
  // This would be more sophisticated in a real app, extracting materials
  // information from experiment data
  
  let content = 'List of specific materials and equipment needed for this experiment:\n\n';
  
  // Add specialized equipment based on analysis types
  if (experimentData.analysisTypes && experimentData.analysisTypes.length > 0) {
    content += '## Required Equipment\n\n';
    
    if (experimentData.analysisTypes.includes('descriptiveStats') || 
        experimentData.analysisTypes.includes('hypothesisTesting') || 
        experimentData.analysisTypes.includes('regression') || 
        experimentData.analysisTypes.includes('anova')) {
      content += '- Computer with appropriate statistical software (SPSS, R, or similar)\n';
      content += '- Data collection sheets or electronic data collection system\n';
    }
    
    if (experimentData.analysisTypes.includes('timeSeries')) {
      content += '- Time-synchronized data logging equipment\n';
      content += '- Time series analysis software\n';
    }
    
    if (experimentData.analysisTypes.includes('clustering') || 
        experimentData.analysisTypes.includes('pca')) {
      content += '- High-performance computing resources for complex analyses\n';
      content += '- Specialized data visualization software\n';
    }
  }
  
  // Add experiment-specific materials based on experiment purpose
  content += '\n## Experiment-Specific Materials\n\n';
  
  // Only include essential experiment materials without general lab items
  if (experimentData.purpose && experimentData.purpose.toLowerCase().includes('cell')) {
    content += '- Cell culture media\n';
    content += '- Cell lines\n';
    content += '- Culture flasks or plates\n';
  } else if (experimentData.purpose && experimentData.purpose.toLowerCase().includes('pcr')) {
    content += '- PCR reagents (primers, nucleotides, buffer)\n';
    content += '- Thermal cycler\n';
    content += '- DNA template\n';
  } else {
    content += '- Sample materials specific to your experiment\n';
    content += '- Measurement instruments\n';
    content += '- Experimental apparatus\n';
  }
  
  return content;
}

/**
 * Generate methods content based on experiment data
 * @param {Object} experimentData - Experiment data
 * @returns {String} Formatted methods content
 */
function generateMethodsContent(experimentData) {
  let content = 'Detailed operational steps for conducting the experiment:\n\n';
  
  content += '## Sample Preparation\n\n';
  
  // Generate experiment-specific preparation steps
  if (experimentData.purpose) {
    if (experimentData.purpose.toLowerCase().includes('pcr')) {
      content += '1. Prepare the PCR master mix in a sterile microcentrifuge tube\n';
      content += '2. Add appropriate volumes of primers, nucleotides, and buffer according to your specific protocol\n';
      content += '3. Aliquot master mix into individual PCR tubes\n';
      content += '4. Add template DNA to each reaction tube\n\n';
    } else if (experimentData.purpose.toLowerCase().includes('cell')) {
      content += '1. Warm cell culture media to 37°C in a water bath\n';
      content += '2. Prepare sterile culture vessels in the biosafety cabinet\n';
      content += '3. Thaw cells according to established protocols\n';
      content += '4. Seed cells at appropriate density for your experimental design\n\n';
    } else {
      content += '1. Prepare samples according to the specific requirements of your experiment\n';
      content += '2. Label all samples clearly with sample ID, date, and experimental condition\n';
      content += '3. Create experimental and control groups as specified in your design\n\n';
    }
  } else {
    content += '1. Prepare samples according to the specific requirements of your experiment\n';
    content += '2. Label all samples clearly with sample ID, date, and experimental condition\n';
    content += '3. Create experimental and control groups as specified in your design\n\n';
  }
  
  content += '## Data Collection Procedure\n\n';
  content += '1. Set up measurement equipment according to the manufacturer\'s specifications\n';
  content += '2. Calibrate instruments using appropriate standards\n';
  content += '3. Perform measurements on samples in a systematic order\n';
  content += '4. Record all data in your lab notebook or electronic data collection system\n';
  content += '5. Include replicate measurements to ensure reproducibility\n\n';
  
  content += '## Quality Control\n\n';
  content += '1. Run appropriate positive and negative controls\n';
  content += '2. Perform validation checks on instruments before and after data collection\n';
  content += '3. Document any deviations from the protocol and potential sources of error\n';
  
  return content;
}

/**
 * Generate data analysis content based on experiment data
 * @param {Object} experimentData - Experiment data
 * @returns {String} Formatted data analysis content
 */
function generateDataAnalysisContent(experimentData) {
  let content = 'Data collection and analysis protocol:\n\n';
  
  // Add data collection instructions
  content += '## Data Collection Framework\n\n';
  content += '1. Create a data collection spreadsheet with the following columns:\n';
  content += '   - Sample ID/Group\n';
  content += '   - Experimental condition\n';
  content += '   - Measurement values (with units)\n';
  content += '   - Date and time of measurement\n';
  content += '   - Observer initials\n';
  content += '2. Establish consistent measurement intervals\n';
  content += '3. Document environmental conditions that may affect results\n\n';
  
  // Add analysis types based on experiment configuration
  content += '## Analysis Workflow\n\n';
  
  if (experimentData.analysisTypes && experimentData.analysisTypes.length > 0) {
    experimentData.analysisTypes.forEach(analysisType => {
      switch (analysisType) {
        case 'descriptiveStats':
          content += '### Descriptive Statistics\n';
          content += '1. Calculate central tendency measures (mean, median, mode)\n';
          content += '2. Determine dispersion measures (standard deviation, variance, range)\n';
          content += '3. Identify outliers using boxplots or z-scores\n\n';
          break;
          
        case 'hypothesisTesting':
          content += '### Hypothesis Testing\n';
          content += '1. Define null and alternative hypotheses clearly\n';
          content += '2. Select appropriate statistical test based on data distribution\n';
          content += '3. Set significance level (α) before conducting analysis\n';
          content += '4. Calculate p-value and compare to α\n';
          content += '5. Record effect sizes to quantify practical significance\n\n';
          break;
          
        case 'regression':
          content += '### Regression Analysis\n';
          content += '1. Check assumptions (linearity, independence, homoscedasticity)\n';
          content += '2. Fit appropriate regression model to data\n';
          content += '3. Validate model using residual analysis\n';
          content += '4. Calculate R² or adjusted R² to assess model fit\n\n';
          break;
          
        case 'anova':
          content += '### ANOVA\n';
          content += '1. Check assumptions (normality, homogeneity of variance)\n';
          content += '2. Conduct appropriate ANOVA test (one-way, two-way, repeated measures)\n';
          content += '3. Perform post-hoc tests for significant results\n';
          content += '4. Calculate effect sizes (η², ω²)\n\n';
          break;
          
        case 'timeSeries':
          content += '### Time Series Analysis\n';
          content += '1. Plot time series data to identify patterns\n';
          content += '2. Test for stationarity using appropriate statistical tests\n';
          content += '3. Apply decomposition techniques to separate trend, seasonality, and noise\n';
          content += '4. Fit appropriate time series models (ARIMA, exponential smoothing)\n\n';
          break;
          
        case 'clustering':
          content += '### Clustering Analysis\n';
          content += '1. Standardize or normalize data as appropriate\n';
          content += '2. Determine optimal number of clusters using methods like elbow or silhouette\n';
          content += '3. Apply clustering algorithm (k-means, hierarchical, DBSCAN)\n';
          content += '4. Validate clusters using internal and external validation metrics\n\n';
          break;
          
        case 'pca':
          content += '### Principal Component Analysis\n';
          content += '1. Standardize variables before analysis\n';
          content += '2. Calculate correlation/covariance matrix\n';
          content += '3. Extract principal components and eigenvalues\n';
          content += '4. Determine number of components to retain based on variance explained\n';
          content += '5. Interpret component loadings\n\n';
          break;
          
        case 'correlation':
          content += '### Correlation Analysis\n';
          content += '1. Calculate appropriate correlation coefficients (Pearson, Spearman)\n';
          content += '2. Test significance of correlations\n';
          content += '3. Create correlation matrix for multiple variables\n';
          content += '4. Visualize correlations using heatmap or network diagram\n\n';
          break;
          
        default:
          content += `### ${analysisType} Analysis\n`;
          content += '1. Define specific analysis procedures for this method\n';
          content += '2. Document computational steps in detail\n';
          content += '3. Include validation criteria for results\n\n';
      }
    });
  } else {
    content += '- Select appropriate analysis methods based on your data and research questions\n';
  }
  
  // Add visualization types based on experiment configuration
  if (experimentData.visualizationTypes && experimentData.visualizationTypes.length > 0) {
    content += '\n## Data Visualization Strategy\n\n';
    
    experimentData.visualizationTypes.forEach(vizType => {
      switch (vizType) {
        case 'line':
          content += '- Create line graphs to show trends over time or conditions with proper axis labels and legend\n';
          break;
          
        case 'bar':
          content += '- Use bar charts with error bars to compare different categories or groups\n';
          break;
          
        case 'scatter':
          content += '- Generate scatter plots with regression lines to examine relationships between variables\n';
          break;
          
        case 'heatmap':
          content += '- Create heatmaps with appropriate color scales to visualize complex datasets or correlations\n';
          break;
          
        default:
          content += `- Produce ${vizType} visualizations with consistent styling and clear annotations\n`;
      }
    });
  }
  
  return content;
}

export default protocolService;