import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Loader, ChevronDown, ChevronUp } from 'lucide-react';

const TextProcessingWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [expandedStep, setExpandedStep] = useState(0);

  const steps = [
    {
      name: 'File Loading',
      description: 'Loads the input file into the system',
      example: 'Input: "example.txt"\nOutput: FileObject { path: "/path/to/example.txt", content: "This is the content of the file..." }'
    },
    {
      name: 'Preprocessing',
      description: 'Extracts metadata and preprocesses the text content',
      example: 'Input: "# Title\\nThis is some content."\nOutput: { metadata: { title: "Title" }, content: "This is some content." }'
    },
    {
      name: 'Text Segmentation',
      description: 'Splits the text into manageable segments',
      example: 'Input: "This is a sentence. Here\'s another one."\nOutput: ["This is a sentence.", "Here\'s another one."]'
    },
    {
      name: 'Tokenization',
      description: 'Breaks down segments into individual tokens',
      example: 'Input: "This is a sentence."\nOutput: ["This", "is", "a", "sentence", "."]'
    },
    {
      name: 'NLP Analysis',
      description: 'Performs part-of-speech tagging, dependency parsing, and named entity recognition',
      example: 'Input: "John visited New York."\nOutput: [{ word: "John", pos: "PROPN", dep: "nsubj", ner: "PERSON" }, ...]'
    },
    {
      name: 'Topic Modeling',
      description: 'Infers topics from the processed text',
      example: 'Input: [processed documents]\nOutput: { topics: ["technology", "science", "politics"], distribution: [0.4, 0.3, 0.3] }'
    },
    {
      name: 'LLM Analysis',
      description: 'Uses a language model to generate insights about the text',
      example: 'Input: [processed text]\nOutput: "The text primarily discusses advancements in artificial intelligence, focusing on..."'
    },
    {
      name: 'Result Display',
      description: 'Presents the analysis results to the user',
      example: 'Output: Interactive dashboard showing topics, key entities, sentiment analysis, and generated insights'
    }
  ];

  useEffect(() => {
    setExpandedStep(currentStep);
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompleted([...completed, currentStep]);
    } else {
      setCompleted([...completed, currentStep]);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompleted([]);
    setExpandedStep(0);
  };

  const toggleExpand = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">TextProcessingWorkflow</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              index === currentStep
                ? 'bg-blue-100 border-blue-500'
                : completed.includes(index)
                ? 'bg-green-100 border-green-500'
                : 'bg-white'
            } border transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-center cursor-pointer" onClick={() => toggleExpand(index)}>
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3">
                {completed.includes(index) ? (
                  <Check className="text-green-500" />
                ) : index === currentStep ? (
                  <Loader className="text-blue-500 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{step.name}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {expandedStep === index ? (
                <ChevronUp className="text-gray-400 ml-3" />
              ) : (
                <ChevronDown className="text-gray-400 ml-3" />
              )}
            </div>
            <div className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
              expandedStep === index ? 'max-h-40' : 'max-h-0'
            }`}>
              <div className="p-2 bg-gray-50 rounded">
                <pre className="text-sm overflow-x-auto">{step.example}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        {currentStep < steps.length - 1 || !completed.includes(steps.length - 1) ? (
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next Step'}
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default TextProcessingWorkflow;
