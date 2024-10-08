import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Book, Code, Cpu, FileText, Layers, MessageSquare, GitBranch } from 'lucide-react';
import TextProcessingWorkflow from './TextProcessingWorkflow';

const FlowbotsLearningDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'architecture', name: 'Architecture', icon: <Cpu className="w-4 h-4" /> },
    { id: 'workflows', name: 'Workflows', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'nlp', name: 'NLP & Topic Modeling', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'code', name: 'Code Insights', icon: <Code className="w-4 h-4" /> },
  ];

  const keyLearnings = [
    { category: 'Architecture', value: 85 },
    { category: 'Workflows', value: 92 },
    { category: 'NLP', value: 78 },
    { category: 'Topic Modeling', value: 70 },
    { category: 'Ruby Gems', value: 88 },
  ];

  const contentSections = {
    overview: (
      <div>
        <h3 className="text-xl font-semibold mb-4">Project Overview</h3>
        <p className="mb-4">
          Flowbots is an advanced text processing and analysis system that combines workflow orchestration,
          natural language processing, and topic modeling to provide powerful document analysis capabilities.
        </p>
        <h4 className="text-lg font-semibold mb-2">Key Features:</h4>
        <ul className="list-disc list-inside mb-4">
          <li>Flexible workflow system using Jongleur for task orchestration</li>
          <li>Advanced NLP capabilities including tokenization and named entity recognition</li>
          <li>Topic modeling with dynamic model training and inference</li>
          <li>Redis-based data persistence using Ohm models</li>
          <li>Custom nano-bot cartridges for specialized AI-powered tasks</li>
        </ul>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={keyLearnings}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ),
    architecture: (
      <div>
        <h3 className="text-xl font-semibold mb-4">System Architecture</h3>
        <p className="mb-4">
          The Flowbots architecture is designed for modularity and flexibility, with key components including:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>CLI: The main entry point for user interaction</li>
          <li>WorkflowOrchestrator: Manages the execution of workflows and tasks</li>
          <li>Task Processors: Specialized classes for text processing and analysis</li>
          <li>Ohm Models: Data persistence layer for storing document information</li>
          <li>NanoBot Integration: Utilizes nano-bot cartridges for AI-powered tasks</li>
        </ul>
        <p>
          This architecture allows for easy extension and customization of the text processing pipeline.
        </p>
      </div>
    ),
    workflows: (
      <div>
        <h3 className="text-xl font-semibold mb-4">Workflow System</h3>
        <p className="mb-4">
          Flowbots uses a flexible workflow system to orchestrate various text processing and analysis tasks.
          The main workflow is the TextProcessingWorkflow, which is demonstrated below:
        </p>
        <TextProcessingWorkflow />
      </div>
    ),
    nlp: (
      <div>
        <h3 className="text-xl font-semibold mb-4">NLP & Topic Modeling</h3>
        <p className="mb-4">
          Flowbots integrates advanced NLP and topic modeling capabilities:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>NLP tasks include tokenization, part-of-speech tagging, and named entity recognition</li>
          <li>Topic modeling is implemented using the TopicModelProcessor</li>
          <li>The system can dynamically train and infer topics from processed text</li>
          <li>Integration with external language models for high-level analysis and insights generation</li>
        </ul>
        <p>
          These capabilities enable deep analysis and understanding of text content, providing valuable
          insights and structuring of unstructured text data.
        </p>
      </div>
    ),
    code: (
      <div>
        <h3 className="text-xl font-semibold mb-4">Code Insights</h3>
        <p className="mb-4">
          The Flowbots project leverages various Ruby gems and coding practices:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Jongleur: Used for workflow orchestration and task management</li>
          <li>Ohm: Provides object-hash mapping for Redis, used in data persistence</li>
          <li>Ruby-spacy: Enables advanced NLP capabilities</li>
          <li>Thor: Used for building the command-line interface</li>
          <li>Modular design: Enhances maintainability and extensibility of the codebase</li>
        </ul>
        <p>
          The project demonstrates effective use of Ruby's object-oriented features and metaprogramming
          capabilities to create a flexible and powerful text processing system.
        </p>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Flowbots Learning Dashboard</h1>
      <div className="mb-8">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-indigo-600 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        {contentSections[activeTab]}
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Explore the dashboard to learn more about the Flowbots project and its key components.
        </p>
      </div>
    </div>
  );
};

export default FlowbotsLearningDashboard;
