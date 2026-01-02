import mermaid from 'mermaid';

/**
 * Reads CSS variables from document root and maps them to Mermaid theme configuration
 * @param isDark - Whether dark mode is active
 * @returns Mermaid theme configuration object
 */
export const getMermaidTheme = (isDark: boolean) => {
  const root = document.documentElement;
  const getVar = (name: string) =>
    getComputedStyle(root).getPropertyValue(name).trim();

  return {
    theme: 'base' as const,
    themeVariables: {
      darkMode: isDark,
      // Primary colors
      primaryColor: getVar('--accent'),
      primaryTextColor: getVar('--foreground'),
      primaryBorderColor: getVar('--border'),

      // Secondary/tertiary colors
      secondaryColor: getVar('--surface'),
      secondaryTextColor: getVar('--foreground'),
      secondaryBorderColor: getVar('--border'),
      tertiaryColor: getVar('--muted'),
      tertiaryTextColor: getVar('--foreground'),
      tertiaryBorderColor: getVar('--border'),

      // Background and text
      background: getVar('--background'),
      mainBkg: getVar('--background'),
      secondBkg: getVar('--surface'),
      textColor: getVar('--foreground'),

      // Lines and borders
      lineColor: getVar('--border'),
      border1: getVar('--border'),
      border2: getVar('--border'),

      // Font family
      fontFamily: getVar('--font-mono'),

      // Node styling
      nodeBorder: getVar('--border'),
      clusterBkg: getVar('--surface'),
      clusterBorder: getVar('--border'),

      // Edge styling
      edgeLabelBackground: getVar('--surface'),

      // Sequence diagram colors
      actorBorder: getVar('--border'),
      actorBkg: getVar('--surface'),
      actorTextColor: getVar('--foreground'),
      actorLineColor: getVar('--border'),
      signalColor: getVar('--foreground'),
      signalTextColor: getVar('--foreground'),
      labelBoxBkgColor: getVar('--surface'),
      labelBoxBorderColor: getVar('--border'),
      labelTextColor: getVar('--foreground'),
      loopTextColor: getVar('--foreground'),
      noteBorderColor: getVar('--border'),
      noteBkgColor: getVar('--surface'),
      noteTextColor: getVar('--foreground'),
      activationBorderColor: getVar('--border'),
      activationBkgColor: getVar('--surface'),
      sequenceNumberColor: getVar('--foreground'),
    },
  };
};

/**
 * Initializes Mermaid with theme configuration based on current mode
 * @param isDark - Whether dark mode is active
 */
export const initMermaid = (isDark: boolean) => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    ...getMermaidTheme(isDark),
    securityLevel: 'loose',
    fontFamily: 'var(--font-mono)',
  });
};
