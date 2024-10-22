import React, { useState, useEffect } from 'react';
import { Zap, BarChart2, Percent, Hash, Tag, CheckCircle, AlertCircle } from 'lucide-react';

const CompressionWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [stats, setStats] = useState({
    compressionRatio: 0,
    originalTokens: 2366,
    compressedTokens: 0,
    classifications: ['Mathematical', 'Educational', 'Problem-solving'],
  });

  const originalPrompt = `The given text consists of 8 questions with step-by-step solutions. Each question involves mathematical problems, such as calculating the number of hours to study, scoring points in a basketball game, determining the number of items, calculating the cost of fruits, and finding the percentage of students who do not like to play basketball.

Example questions:
1. Angelo and Melanie need to study for 12 hours...
2. Mark's basketball team scores 25 2-pointers...
...
8. In a certain school, 2/3 of the male students like to play basketball...`;

  const compressedPrompt = `1. Angelo and Melanie study 12 hours: 3hrs/chapter, 1.5hrs/worksheet. Max 4hrs/day. Days to study?
2. Basketball: Team A - 25 (2pt), 8 (3pt), 10 (FT). Team B - 50 (2pt), 4 (3pt), 5 (FT). Total points?
...
8. School: 2/3 male, 1/5 female play basketball. M:F ratio 3:2, 1000 students. % not playing?

Answers: 4, 201, ..., 52`;

  const compressionSteps = [
    {
      title: 'Correlate semantics',
      description: 'Identify key themes and structures in the prompt.',
      action: 'Analyzing prompt structure and content...',
      result: 'Identified 8 math problems with step-by-step solutions.',
      detail: 'This step involves understanding the overall context and purpose of the prompt. We recognize patterns in question structure and identify common elements across all problems.'
    },
    // ... other steps ...
  ];

  useEffect(() => {
    if (isCompressing) {
      const timer = setTimeout(() => {
        if (activeStep < compressionSteps.length - 1) {
          setActiveStep(prevStep => prevStep + 1);
          setStats(prevStats => ({
            ...prevStats,
            compressedTokens: Math.max(117, prevStats.originalTokens - (activeStep + 1) * 375),
            compressionRatio: ((prevStats.originalTokens - (prevStats.originalTokens - (activeStep + 1) * 375)) / prevStats.originalTokens * 100).toFixed(1)
          }));
        } else {
          setIsCompressing(false);
          setStats(prevStats => ({
            ...prevStats,
            compressedTokens: 117,
            compressionRatio: ((prevStats.originalTokens - 117) / prevStats.originalTokens * 100).toFixed(1)
          }));
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeStep, isCompressing, compressionSteps.length]);

  useEffect(() => {
    setCurrentPrompt(activeStep === compressionSteps.length - 1 ? compressedPrompt : originalPrompt);
  }, [activeStep, compressedPrompt, originalPrompt, compressionSteps.length]);

  const startCompression = () => {
    setActiveStep(0);
    setIsCompressing(true);
    setStats(prevStats => ({
      ...prevStats,
      compressedTokens: prevStats.originalTokens,
      compressionRatio: 0
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Advanced Prompt Compression Workflow</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <PromptBox 
            title="Current Prompt" 
            content={currentPrompt} 
            tokenCount={stats.compressedTokens}
          />
          <button 
            onClick={startCompression}
            disabled={isCompressing}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isCompressing ? "Compressing..." : "Start Compression"}
          </button>
        </div>
        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-2">Compression Process</h2>
            <div className="flex justify-center items-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Zap size={32} color="white" />
              </div>
            </div>
            {compressionSteps.map((step, index) => (
              <CompressionStep
                key={index}
                step={step}
                isActive={activeStep === index}
                isComplete={activeStep > index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <CompressionStats stats={stats} />
    </div>
  );
};

const PromptBox = ({ title, content, tokenCount }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded max-h-96 overflow-y-auto">
      {content}
    </pre>
    <p className="mt-2 text-sm text-gray-600">Current tokens: {tokenCount}</p>
  </div>
);

const CompressionStep = ({ step, isActive, isComplete, onClick }) => (
  <div
    className={`p-2 mb-2 rounded cursor-pointer transition-colors ${
      isActive ? 'bg-blue-100' : isComplete ? 'bg-green-100' : 'hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <h3 className="font-semibold flex-grow">{step.title}</h3>
      {isComplete && <CheckCircle size={20} className="text-green-500" />}
      {isActive && <AlertCircle size={20} className="text-blue-500" />}
    </div>
    {isActive && (
      <div className="mt-2">
        <p className="text-sm mb-1"><strong>Description:</strong> {step.description}</p>
        <p className="text-sm mb-1"><strong>Action:</strong> {step.action}</p>
        <p className="text-sm mb-1"><strong>Result:</strong> {step.result}</p>
        <p className="text-sm"><strong>Detail:</strong> {step.detail}</p>
      </div>
    )}
  </div>
);

const CompressionStats = ({ stats }) => (
  <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Compression Statistics</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatItem 
        icon={<Percent size={24} />}
        label="Compression Ratio"
        value={`${stats.compressionRatio}%`}
      />
      <StatItem 
        icon={<Hash size={24} />}
        label="Original Tokens"
        value={stats.originalTokens}
      />
      <StatItem 
        icon={<Hash size={24} />}
        label="Compressed Tokens"
        value={stats.compressedTokens}
      />
      <StatItem 
        icon={<BarChart2 size={24} />}
        label="Tokens Saved"
        value={stats.originalTokens - stats.compressedTokens}
      />
    </div>
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Text Classifications:</h3>
      <div className="flex flex-wrap gap-2">
        {stats.classifications.map((classification, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            <Tag size={14} className="inline mr-1" />
            {classification}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const StatItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="mr-2 text-blue-500">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default CompressionWorkflow;
