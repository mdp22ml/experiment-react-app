import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import FileUpload from '../components/forms/FileUpload/FileUpload';
import AnalysisSelection from '../components/forms/AnalysisSelection/AnalysisSelection';
import AnalysisResults from '../components/analysis/AnalysisResults';
import ChartDisplay from '../components/visualization/ChartDisplay';
import AIInterpretation from '../components/analysis/AIInterpretation';
import { useExperiment } from '../contexts/ExperimentContext';
import analysisService from '../services/analysisService';
import visualizationService from '../services/visualizationService';

const DataAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experiment } = useExperiment();

  const [step, setStep] = useState('upload');
  const [files, setFiles] = useState([]);
  const [availableMethods, setAvailableMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [methodParams, setMethodParams] = useState({});
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [availableCharts, setAvailableCharts] = useState([]);
  const [visualization, setVisualization] = useState(null);
  const [aiInterpretation, setAIInterpretation] = useState(null);
  const [loading, setLoading] = useState({
    methods: false,
    analysis: false,
    visualization: false,
    interpretation: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.uploadedFiles?.length > 0) {
      setFiles(location.state.uploadedFiles);
      setStep('select');
    }

    const loadMethods = async () => {
      setLoading(prev => ({ ...prev, methods: true }));
      try {
        const methods = await analysisService.getAvailableAnalysisMethods();
        setAvailableMethods(methods);
      } catch (err) {
        setError('Failed to load available analysis methods.');
      } finally {
        setLoading(prev => ({ ...prev, methods: false }));
      }
    };

    loadMethods();
  }, [location.state]);

  const handleFilesUploaded = (uploadedFiles) => {
    setFiles(uploadedFiles);
    if (uploadedFiles.length > 0) setStep('select');
  };

  const handleMethodSelect = (methodId) => {
    const method = availableMethods.find(m => m.id === methodId);
    setSelectedMethod(method);

    if (method?.parameters) {
      const defaults = {};
      method.parameters.forEach(p => { defaults[p.id] = p.default; });
      setMethodParams(defaults);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedMethod || files.length === 0) return;
    setLoading(prev => ({ ...prev, analysis: true }));
    setError(null);

    try {
      const job = await analysisService.createAnalysisJob({
        methodId: selectedMethod.id,
        params: methodParams,
        fileIds: files.map(f => f.name)
      });

      const results = await analysisService.getAnalysisResults(`${selectedMethod.id}-${job.analysisId}`);
      setAnalysisResults(results);

      const chartOptions = await visualizationService.getSuitableVisualizationsForAnalysis(selectedMethod.id);
      setAvailableCharts(chartOptions);
      if (chartOptions.length > 0) {
        setSelectedChart(chartOptions[0].id);
        await handleVisualizationChange(chartOptions[0].id);
      }

      await generateAIInterpretation(results);
      setStep('results');
    } catch (err) {
      setError('Failed to complete analysis.');
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  const handleVisualizationChange = async (chartTypeId) => {
    if (!analysisResults) return;
    setLoading(prev => ({ ...prev, visualization: true }));
    try {
      setSelectedChart(chartTypeId);
      const visJob = await visualizationService.createVisualization({
        analysisId: analysisResults.id,
        chartType: chartTypeId,
        dataColumns: ['all']
      });
      const vis = await visualizationService.getVisualization(`${chartTypeId}-${visJob.visualizationId}`);
      setVisualization(vis);
    } catch (err) {
      setError('Failed to generate visualization.');
    } finally {
      setLoading(prev => ({ ...prev, visualization: false }));
    }
  };

  const generateAIInterpretation = async (results) => {
    if (!results) return;
    setLoading(prev => ({ ...prev, interpretation: true }));
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Interpret the ${selectedMethod.name} results: ${results.textualSummary}` })
      });
      const data = await res.json();
      setAIInterpretation(data);
    } catch (err) {
      setError('AI interpretation failed.');
    } finally {
      setLoading(prev => ({ ...prev, interpretation: false }));
    }
  };

  const handleExportResults = (format) => {
    if (!analysisResults) return;
    analysisService.exportAnalysisResults(analysisResults.id, format)
      .then(result => alert(`Mock download URL: ${result.downloadUrl}`))
      .catch(err => setError('Export failed'));
  };

  const renderStep = () => {
    if (step === 'upload') {
      return <FileUpload onDataUploaded={handleFilesUploaded} />;
    }
    if (step === 'select') {
      return (
        <>
          <AnalysisSelection
            analysisTypes={availableMethods}
            selectedFile={files[0]}
            onAnalysisSelect={handleMethodSelect}
            isLoading={loading.methods}
          />
          <Button onClick={handleStartAnalysis} disabled={!selectedMethod || loading.analysis}>
            {loading.analysis ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </>
      );
    }
    if (step === 'results') {
      return (
        <>
          <AnalysisResults
            results={analysisResults}
            selectedAnalysis={selectedMethod.id}
            visualizationTypes={availableCharts}
            onGenerateVisualization={handleVisualizationChange}
            onRequestInterpretation={() => generateAIInterpretation(analysisResults)}
            onExportResults={handleExportResults}
            isLoading={loading.analysis}
          />
          <ChartDisplay visualization={visualization} isLoading={loading.visualization} />
          <AIInterpretation
            interpretation={aiInterpretation}
            analysisResults={analysisResults}
            visualization={visualization}
            isLoading={loading.interpretation}
          />
        </>
      );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Data Analysis</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {renderStep()}
    </div>
  );
};

export default DataAnalysis;
