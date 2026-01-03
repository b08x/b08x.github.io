import React, { useState, useEffect, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { getSyntaxTheme } from '../utils/syntaxTheme';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  fileName?: string;
}

/**
 * CodeBlock Component
 *
 * Renders syntax-highlighted code with copy-to-clipboard functionality.
 * Automatically responds to dark/light mode changes.
 *
 * Usage:
 * <CodeBlock
 *   code="const x = 42;"
 *   language="javascript"
 *   showLineNumbers={true}
 *   fileName="example.js"
 * />
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = false,
  fileName,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => getSyntaxTheme());

  // Watch for dark mode changes using MutationObserver pattern
  useEffect(() => {
    const updateTheme = () => {
      setCurrentTheme(getSyntaxTheme());
    };

    // MutationObserver pattern from MermaidViewer.tsx
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Copy to clipboard handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Announce to screen readers
      const announcement = 'Code copied to clipboard';
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = announcement;
      document.body.appendChild(liveRegion);
      setTimeout(() => document.body.removeChild(liveRegion), 3000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Handle empty code blocks
  if (!code || code.trim().length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 text-muted font-mono text-sm my-4">
        <em>Empty code block</em>
      </div>
    );
  }

  // Supported languages with fallback to plain text
  const SUPPORTED_LANGUAGES = [
    'javascript',
    'typescript',
    'python',
    'ruby',
    'bash',
    'markdown',
    'json',
    'yaml',
    'jsx',
    'tsx',
    'css',
    'scss',
    'html',
    'sql',
    'go',
    'rust',
    'java',
    'c',
    'cpp',
  ];

  const normalizedLanguage = SUPPORTED_LANGUAGES.includes(language)
    ? language
    : 'text';

  // Memoize highlighted code to prevent re-renders
  const highlightedCode = useMemo(
    () => (
      <SyntaxHighlighter
        language={normalizedLanguage}
        style={currentTheme}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        customStyle={{
          margin: 0,
          background: 'transparent',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'var(--font-mono)',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    ),
    [code, normalizedLanguage, showLineNumbers, currentTheme]
  );

  return (
    <div className="code-block-wrapper relative my-4 group">
      {/* Optional file name header */}
      {fileName && (
        <div className="bg-surface border border-b-0 border-border rounded-t-lg px-4 py-2 text-xs font-mono text-muted flex items-center justify-between">
          <span>{fileName}</span>
        </div>
      )}

      {/* Code container */}
      <div className="relative">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
          className="absolute top-2 right-2 p-2 rounded-md bg-surface/80 border border-border opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 z-10"
        >
          {copied ? (
            <svg
              className="w-4 h-4 text-chart-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>

        {/* Syntax highlighted code */}
        <div className={`syntax-highlighter-container ${fileName ? 'rounded-b-lg' : 'rounded-lg'} overflow-hidden`}>
          {highlightedCode}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
