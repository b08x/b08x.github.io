/**
 * Code Processing Utilities
 * Extract and process code blocks from Jekyll/Rouge-generated HTML
 */

/**
 * Represents a code block extracted from HTML content
 */
export interface CodeBlock {
  code: string;
  language: string;
  index: number;
  fileName?: string;
}

/**
 * Language alias mapping for common variations
 * Maps Jekyll/Rouge language identifiers to Prism language keys
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  rb: 'ruby',
  yml: 'yaml',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  md: 'markdown',
  rs: 'rust',
  go: 'go',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
};

/**
 * Check if HTML content contains code blocks
 *
 * @param html - HTML string to check
 * @returns true if code blocks are present
 */
export const hasCodeBlocks = (html: string): boolean => {
  return html.includes('class="language-') || html.includes('class="highlighter-rouge"');
};

/**
 * Detect a filename from the first line of a code block
 * Looks for patterns like # filename, // filename, or /* filename *\/
 *
 * @param code - Raw code string
 * @returns detected filename or undefined
 */
export const detectFileName = (code: string): string | undefined => {
  const lines = code.split('\n');
  if (lines.length === 0) return undefined;

  const firstLine = lines[0].trim();

  // Patterns for various languages
  const patterns = [
    /^#\s+(.+)$/,             // # filename (Ruby, Python, Shell, YAML)
    /^\/\/\s+(.+)$/,         // // filename (JS, TS, C, C++, Go)
    /^\/\*\s*(.+)\s*\*\/$/,   // /* filename */ (CSS, JS)
    /^<!--\s*(.+)\s*-->$/,    // <!-- filename --> (HTML, MD)
    /^--\s+(.+)$/,           // -- filename (SQL, Lua)
  ];

  for (const pattern of patterns) {
    const match = firstLine.match(pattern);
    if (match && match[1]) {
      const fileName = match[1].trim();
      // Basic validation: should look like a filename (not just a comment)
      // We look for a dot or a path separator
      if (fileName.includes('.') || fileName.includes('/')) {
        return fileName;
      }
    }
  }

  return undefined;
};

/**
 * Extract code blocks from HTML content
 *
 * Parses HTML looking for Rouge-generated code blocks:
 * <div class="language-{lang} highlighter-rouge">
 *   <div class="highlight">
 *     <pre class="highlight"><code>...</code></pre>
 *   </div>
 * </div>
 *
 * @param html - HTML string containing code blocks
 * @returns Array of extracted code blocks with metadata
 */
export const extractCodeBlocks = (html: string): CodeBlock[] => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Check for parser errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.error('HTML parsing error:', parserError.textContent);
      return [];
    }

    const codeBlocks: CodeBlock[] = [];

    // Find all Rouge-generated code containers
    const containers = doc.querySelectorAll('div[class*="language-"]');

    containers.forEach((container, index) => {
      // Extract language from class name
      const classNames = container.className.split(' ');
      const languageClass = classNames.find((cls) => cls.startsWith('language-'));

      if (!languageClass) return;

      let language = languageClass.replace('language-', '');

      // Apply aliases
      language = LANGUAGE_ALIASES[language] || language;

      // Extract code content
      const codeElement = container.querySelector('pre code');
      if (!codeElement) return;

      let code = codeElement.textContent || '';

      // Extract optional file name from data attribute
      let fileName = container.getAttribute('data-filename') || undefined;

      // If no data-filename, try to detect from first line
      if (!fileName) {
        fileName = detectFileName(code);
      }

      codeBlocks.push({
        code,
        language,
        index,
        fileName,
      });
    });

    return codeBlocks;
  } catch (err) {
    console.error('Failed to parse HTML:', err);
    return [];
  }
};

/**
 * Replace code blocks in HTML with React island markers
 *
 * Converts:
 * <div class="language-javascript">...</div>
 *
 * To:
 * <div data-island="CodeBlock" data-props='{"code":"...","language":"javascript"}'></div>
 *
 * @param html - Original HTML content
 * @param codeBlocks - Extracted code blocks
 * @returns Modified HTML with island markers
 */
export const replaceCodeBlocksWithIslands = (
  html: string,
  codeBlocks: CodeBlock[]
): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const containers = doc.querySelectorAll('div[class*="language-"]');

    containers.forEach((container, index) => {
      const block = codeBlocks[index];
      if (!block) return;

      // Create island container
      const island = doc.createElement('div');
      island.setAttribute('data-island', 'CodeBlock');
      island.setAttribute(
        'data-props',
        JSON.stringify({
          code: block.code,
          language: block.language,
          fileName: block.fileName,
          showLineNumbers: false,
        })
      );

      // Replace original container
      container.replaceWith(island);
    });

    return doc.body.innerHTML;
  } catch (err) {
    console.error('Failed to replace code blocks:', err);
    return html;
  }
};
