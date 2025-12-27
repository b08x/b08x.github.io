import React, { useState } from 'react';

interface NotebookGuideProps {
  suggestedQuestions?: string[];
  onGenerateContent?: (type: string) => void;
}

const NotebookGuide: React.FC<NotebookGuideProps> = ({
  suggestedQuestions = [],
  onGenerateContent = () => {}
}) => {
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      console.log('Chat submitted:', chatInput);
      setChatInput('');
    }
  };

  const contentTypes = [
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'study-guide', label: 'Study Guide', icon: '📖' },
    { id: 'timeline', label: 'Timeline', icon: '📊' },
    { id: 'briefing', label: 'Briefing Doc', icon: '📄' },
    { id: 'toc', label: 'Table of Contents', icon: '📋' }
  ];

  return (
    <div className="notebook-guide-container space-y-6">
      {/* Help Me Create */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Help me create
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {contentTypes.map(type => (
            <button
              key={type.id}
              onClick={() => onGenerateContent(type.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <span className="text-base">{type.icon}</span>
              <span className="text-gray-700 dark:text-gray-300">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Suggested questions
          </h3>
          <ul className="space-y-2">
            {suggestedQuestions.map((question, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setChatInput(question)}
                  className="text-sm text-left text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-full flex items-center justify-between text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100"
        >
          <span>Chat</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {showChat ? '▼' : '▶'}
          </span>
        </button>

        {showChat && (
          <div className="space-y-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Start typing..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                →
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              NotebookLM may still sometimes give inaccurate responses, so you may want to confirm any facts independently.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotebookGuide;
