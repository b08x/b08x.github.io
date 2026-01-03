import React, { useState, useEffect, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { getSyntaxTheme } from '../utils/syntaxTheme';
import {
  SiJavascript, SiTypescript, SiPython, SiRuby, SiGnubash,
  SiMarkdown, SiReact, SiCss3, SiSass, SiHtml5, SiGo, SiRust, SiC, SiCplusplus
} from 'react-icons/si';
import { VscJson, VscSettings, VscDatabase, VscCode, VscCheck, VscCopy } from 'react-icons/vsc';
import { FaJava } from 'react-icons/fa';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  fileName?: string;
  startingLineNumber?: number;
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
  fileName: propFileName,
  startingLineNumber = 1,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => getSyntaxTheme());
  const [isInList, setIsInList] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Detect if component is inside a list (ul or ol)
  useEffect(() => {
    if (wrapperRef.current) {
      const listItem = wrapperRef.current.closest('li');
      if (listItem) {
        setIsInList(true);
      }
    }
  }, []);

  // Determine actual filename and whether to strip first line
  const { displayFileName, processedCode } = useMemo(() => {
    let activeFileName = propFileName;

    // Split into lines to analyze indentation and content
    const lines = code.split('\n');

    // 1. Find the common indentation (excluding search for filename)
    // This helps handle code blocks indented in markdown lists
    let minIndent = Infinity;
    lines.forEach(line => {
      if (line.trim().length > 0) {
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1].length : 0;
        if (indent < minIndent) minIndent = indent;
      }
    });

    if (minIndent === Infinity) minIndent = 0;

    // 2. Normalize by removing common indentation
    const normalizedLines = lines.map(line =>
      line.length >= minIndent ? line.slice(minIndent) : line.trimStart()
    );

    let finalCodeLines = [...normalizedLines];

    // 3. Detect filename from first line of normalized code
    if (finalCodeLines.length > 0) {
      const firstLine = finalCodeLines[0].trim();

      const patterns = [
        /^#\s+(.+)$/,
        /^\/\/\s+(.+)$/,
        /^\/\*\s*(.+)\s*\*\/$/,
        /^<!--\s*(.+)\s*-->$/,
        /^--\s+(.+)$/,
      ];

      for (const pattern of patterns) {
        const match = firstLine.match(pattern);
        if (match && match[1]) {
          const detected = match[1].trim();
          // If detected matches the prop, or if prop is missing and detected looks like a file
          if (detected === propFileName || (!propFileName && (detected.includes('.') || detected.includes('/')))) {
            activeFileName = detected;
            finalCodeLines = finalCodeLines.slice(1);
            break;
          }
        }
      }
    }

    // Join back and trim leading/trailing empty lines only, preserving internal indentation
    const joined = finalCodeLines.join('\n').replace(/^[\r\n]+|[\r\n\s]+$/g, '');

    return {
      displayFileName: activeFileName,
      processedCode: joined
    };
  }, [code, propFileName]);

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
    if (!processedCode) return;

    try {
      // Try the modern API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(processedCode);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = processedCode;
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
  if (!processedCode || processedCode.trim().length === 0) {
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

  const LANGUAGE_ICONS: Record<string, React.ReactNode> = {
    javascript: <SiJavascript />,
    typescript: <SiTypescript />,
    python: <SiPython />,
    ruby: <SiRuby />,
    bash: <SiGnubash />,
    markdown: <SiMarkdown />,
    json: <VscJson />,
    yaml: <VscSettings />,
    jsx: <SiReact />,
    tsx: <SiReact />,
    css: <SiCss3 />,
    scss: <SiSass />,
    html: <SiHtml5 />,
    sql: <VscDatabase />,
    go: <SiGo />,
    rust: <SiRust />,
    java: <FaJava />,
    c: <SiC />,
    cpp: <SiCplusplus />,
  };

  const LanguageIcon = LANGUAGE_ICONS[normalizedLanguage] || <VscCode />;

  // Memoize highlighted code to prevent re-renders
  const highlightedCode = useMemo(
    () => (
      <SyntaxHighlighter
        language={normalizedLanguage}
        style={currentTheme}
        showLineNumbers={showLineNumbers}
        startingLineNumber={startingLineNumber}
        wrapLines={true}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: 'transparent',
          borderRadius: 'var(--radius-sm, 0.5rem)',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap',
          },
        }}
      >
        {processedCode}
      </SyntaxHighlighter>
    ),
    [processedCode, normalizedLanguage, showLineNumbers, currentTheme]
  );

  return (
    <div
      ref={wrapperRef}
      className={`code-block-wrapper relative group shadow-sm rounded-md overflow-hidden bg-surface border border-border ${isInList ? 'my-3' : 'my-8'
        }`}
    >
      {/* Header with Language Icon, File Name and Copy Button */}
      <div className="bg-background border-b border-border px-4 py-2 flex items-center justify-between tracking-wide">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center text-accent/70"
            title={normalizedLanguage}
          >
            <span className="text-xl">
              {LanguageIcon}
            </span>
          </div>

          {displayFileName && (
            <div className="flex items-center text-foreground/90 font-medium text-[12px]">
              <span className="truncate max-w-[300px]">{displayFileName}</span>
            </div>
          )}
        </div>

        {/* Copy button - Moved to header */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center w-8 h-8 rounded border border-border bg-surface hover:bg-background transition-colors text-muted hover:text-foreground group/btn shadow-sm"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <VscCheck className="text-accent" size={20} />
          ) : (
            <VscCopy className="group-hover/btn:text-accent transition-colors" size={20} />
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
