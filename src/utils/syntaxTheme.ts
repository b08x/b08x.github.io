import React from 'react';

/**
 * Custom syntax highlighting theme matching terminal color palette
 * Reads CSS variables dynamically to support dark/light mode switching
 *
 * Color Palette:
 * - chart-1: #3498db (Blue) - Keywords, types, numbers
 * - chart-2: #2ecc71 (Green) - Strings
 * - chart-3: #f1c40f (Yellow) - Functions, classes
 * - chart-4: #e67e22 (Orange) - Operators, tags
 * - chart-5: #e74c3c (Red) - Errors, deleted
 * - muted: #7f8c8d (Light) / #c0c0c0 (Dark) - Comments
 */

export interface SyntaxTheme {
  [key: string]: React.CSSProperties;
}

/**
 * Get CSS variable value from document root
 */
const getCSSVar = (name: string): string => {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(name).trim();
};

/**
 * Generate syntax highlighting theme from CSS variables
 * Call this function when theme changes (dark/light mode switch)
 */
export const getSyntaxTheme = (): SyntaxTheme => {
  return {
    'code[class*="language-"]': {
      color: getCSSVar('--foreground'),
      background: 'transparent',
      fontFamily: getCSSVar('--font-mono'),
      fontSize: '0.9em',
      textAlign: 'left',
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      lineHeight: '1.5',
      tabSize: 2,
      hyphens: 'none',
    },
    'pre[class*="language-"]': {
      color: getCSSVar('--foreground'),
      background: getCSSVar('--bg-code'),
      fontFamily: getCSSVar('--font-mono'),
      fontSize: '0.9em',
      textAlign: 'left',
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      lineHeight: '1.5',
      tabSize: 2,
      hyphens: 'none',
      padding: '1em',
      margin: '1em 0',
      overflow: 'auto',
      borderRadius: getCSSVar('--radius-md'),
      border: `1px solid ${getCSSVar('--border')}`,
    },
    // Comments and documentation
    comment: { color: getCSSVar('--muted'), fontStyle: 'italic' },
    prolog: { color: getCSSVar('--muted') },
    doctype: { color: getCSSVar('--muted') },
    cdata: { color: getCSSVar('--muted') },

    // Punctuation
    punctuation: { color: getCSSVar('--text-secondary') },

    // Properties, constants, and deleted content (Red)
    property: { color: getCSSVar('--chart-5') },
    tag: { color: getCSSVar('--chart-4') },
    boolean: { color: getCSSVar('--chart-5') },
    number: { color: getCSSVar('--chart-1') },
    constant: { color: getCSSVar('--chart-5') },
    symbol: { color: getCSSVar('--chart-5') },
    deleted: { color: getCSSVar('--chart-5') },

    // Selectors and strings (Green)
    selector: { color: getCSSVar('--chart-2') },
    'attr-name': { color: getCSSVar('--chart-3') },
    string: { color: getCSSVar('--chart-2') },
    char: { color: getCSSVar('--chart-2') },
    builtin: { color: getCSSVar('--chart-1') },
    inserted: { color: getCSSVar('--chart-2') },

    // Operators and entities (Orange)
    operator: { color: getCSSVar('--chart-4') },
    entity: { color: getCSSVar('--chart-4') },
    url: { color: getCSSVar('--chart-4') },

    // Attributes and keywords (Accent Blue)
    'attr-value': { color: getCSSVar('--chart-2') },
    keyword: { color: getCSSVar('--accent'), fontWeight: 'bold' },
    atrule: { color: getCSSVar('--accent') },

    // Functions and classes (Yellow)
    function: { color: getCSSVar('--chart-3'), fontWeight: 'bold' },
    'class-name': { color: getCSSVar('--chart-3'), fontWeight: 'bold' },

    // Regex, important, and variables
    regex: { color: getCSSVar('--chart-4') },
    important: { color: getCSSVar('--chart-4'), fontWeight: 'bold' },
    variable: { color: getCSSVar('--chart-1') },

    // Additional token types
    namespace: { opacity: 0.7 },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
  };
};
