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

  // Copy to clipboard handler using a more robust method
  const handleCopy = async () => {
    if (!code) return;

    try {
      // Try the modern API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

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
      setTimeout(() => {
        if (liveRegion.parentNode) {
          liveRegion.parentNode.removeChild(liveRegion);
        }
      }, 3000);
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
          padding: '1.25rem',
          background: 'transparent',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    ),
    [code, normalizedLanguage, showLineNumbers, currentTheme]
  );

  return (
    <div className="code-block-wrapper relative my-8 group shadow-sm rounded-md overflow-hidden bg-surface border border-border">
      {/* Header with File Name, Language and Copy Button */}
      <div className="bg-background border-b border-border px-4 py-3 text-[10px] font-mono text-muted flex items-center justify-between uppercase tracking-wider">
        <div className="flex items-center gap-3">
          {fileName && (
            <>
              <span className="text-foreground/40 hover:text-foreground/70 transition-colors cursor-default">{fileName}</span>
              <div className="w-1 h-3 bg-border/50 rounded-full" />
            </>
          )}
          <span className="text-accent/60 font-bold bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
            {normalizedLanguage}
          </span>
        </div>

        {/* Copy button - Moved to header */}
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
          className={`flex items-center gap-2 px-3 py-1 rounded-md border transition-all duration-300 
            ${copied
              ? 'bg-chart-2/10 border-chart-2/50 text-chart-2'
              : 'bg-surface/50 border-border text-muted hover:border-accent hover:text-accent hover:bg-accent/5'
            } 
            focus:outline-none focus:ring-1 focus:ring-accent/50 hover:scale-[1.02] active:scale-[0.98]`}
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code container */}
      <div className="relative overflow-hidden">

        {/* Syntax highlighted code */}
        <div className="syntax-highlighter-container relative z-10">
          {highlightedCode}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
