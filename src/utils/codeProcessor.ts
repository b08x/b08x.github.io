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

      const code = codeElement.textContent || '';

      // Extract optional file name from data attribute
      const fileName = container.getAttribute('data-filename') || undefined;

      codeBlocks.push({
        code: code.trim(),
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
