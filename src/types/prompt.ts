// Type definitions for YAML-driven PromptFlowDiagram component

export interface PromptTechnique {
  name: string;  // "Style Prompting", "Few-Shot", etc.
  category: 'style' | 'instruction' | 'constraint' | 'logic' | 'exemplar' | 'decomposition' | 'correction';
  description?: string;
}

export interface SFLComponent {
  field?: {
    topic?: string;
    taskType?: string;
    domain?: string;
  };
  tenor?: {
    aiPersona?: string;
    desiredTone?: string;
    userRole?: string;
  };
  mode?: {
    outputFormat?: string;
    rhetoricalStructure?: string;
    channelType?: string;
  };
}

export interface ContextSource {
  id: string;                // YAML key: "principle", "defaults", etc.
  label: string;             // Display: "Core Principle", "Default Rules"
  content: string;           // Actual text from YAML
  technique: PromptTechnique;
  sfl?: Partial<SFLComponent>;
  color: string;             // Border/highlight color
  order: number;             // Animation sequence
}

export interface YAMLPromptData {
  name: string;
  principle?: string;
  defaults?: string[];
  response_modes?: Record<string, any>;
  hard_nos?: string[];
  must_do?: string[];
  self_check?: string[];
  progressive_disclosure?: Record<string, any>;
  length_control?: Record<string, any>;
  exceptions?: string[];
  invisible_rule?: string;
  [key: string]: any;  // Allow custom keys
}

export interface PromptVisualizationConfig {
  contextSources: ContextSource[];
  assembledPrompt: { sections: Array<{ sourceId: string; text: string; }> };
  excludeKeys?: string[];    // Keys to hide (user override)
  includeOnlyKeys?: string[];  // If set, only show these
}

// Enhanced component props
export interface PromptFlowDiagramProps {
  // Backward compatible
  initialStep?: number;

  // New YAML-driven mode
  yamlData?: YAMLPromptData;
  visualizationConfig?: Partial<PromptVisualizationConfig>;

  // Display options
  showTechniques?: boolean;
  colorScheme?: 'default' | 'monochrome' | 'vibrant';
}

// Default mapping configuration
export const DEFAULT_YAML_MAPPINGS: Record<string, Partial<ContextSource>> = {
  principle: {
    label: "Core Principle",
    technique: {
      name: "Style Prompting",
      category: 'style',
      description: "Sets tone and behavioral expectations"
    },
    color: "#3b82f6",
    order: 1
  },
  defaults: {
    label: "Default Rules",
    technique: {
      name: "Instruction Prompting",
      category: 'instruction',
      description: "Direct behavioral directives"
    },
    color: "#22c55e",
    order: 2
  },
  response_modes: {
    label: "Response Modes",
    technique: {
      name: "Few-Shot Prompting",
      category: 'exemplar',
      description: "Example-based pattern demonstration"
    },
    color: "#f97316",
    order: 3
  },
  progressive_disclosure: {
    label: "Progressive Disclosure",
    technique: {
      name: "Decomposition",
      category: 'decomposition',
      description: "Breaking information into manageable chunks"
    },
    color: "#8b5cf6",
    order: 4
  },
  length_control: {
    label: "Length Control",
    technique: {
      name: "Constraint Prompting",
      category: 'constraint',
      description: "Output length and structure constraints"
    },
    color: "#06b6d4",
    order: 5
  },
  hard_nos: {
    label: "Negative Constraints",
    technique: {
      name: "Negative Prompting",
      category: 'constraint',
      description: "Explicitly prohibited behaviors"
    },
    color: "#ef4444",
    order: 6
  },
  must_do: {
    label: "Requirements",
    technique: {
      name: "Instruction Prompting",
      category: 'instruction',
      description: "Mandatory behaviors"
    },
    color: "#10b981",
    order: 7
  },
  exceptions: {
    label: "Exceptions",
    technique: {
      name: "Logic Prompting",
      category: 'logic',
      description: "Conditional override rules"
    },
    color: "#f59e0b",
    order: 8
  },
  invisible_rule: {
    label: "Meta Rules",
    technique: {
      name: "Meta-Instruction",
      category: 'instruction',
      description: "Rules governing rule application"
    },
    color: "#6b7280",
    order: 9
  },
  self_check: {
    label: "Self-Correction",
    technique: {
      name: "Self-Refinement",
      category: 'correction',
      description: "Model validates own output"
    },
    color: "#06b6d4",
    order: 10
  }
};

// Utility: Transform YAML values to display strings
export const transformContent = (value: any): string => {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) {
    return value
      .filter(item => typeof item === 'string')
      .map(item => `• ${item}`)
      .join('\n');
  }
  if (typeof value === 'object' && value !== null) {
    // Pretty-print nested objects
    return Object.entries(value)
      .map(([key, val]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (typeof val === 'object') {
          return `${formattedKey}:\n${transformContent(val)}`;
        }
        return `${formattedKey}: ${val}`;
      })
      .join('\n');
  }
  return String(value);
};

// Process YAML data into context sources
export const processYAMLToContextSources = (
  yamlData?: YAMLPromptData,
  config?: Partial<PromptVisualizationConfig>
): ContextSource[] => {
  if (!yamlData) return [];

  // User override: exclude specific keys
  const excludeKeys = config?.excludeKeys || [];
  const includeOnlyKeys = config?.includeOnlyKeys;

  // Metadata keys to skip
  const metadataKeys = ['name'];

  // Auto-map YAML keys to context sources
  const sources = Object.entries(yamlData)
    .filter(([key]) => {
      // Skip metadata keys
      if (metadataKeys.includes(key)) return false;

      // Apply user overrides
      if (excludeKeys.includes(key)) return false;
      if (includeOnlyKeys && !includeOnlyKeys.includes(key)) return false;

      return true;
    })
    .map(([key, value]) => {
      const mapping = DEFAULT_YAML_MAPPINGS[key] || {
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        technique: { name: "Custom Component", category: 'instruction' as const },
        color: "#9ca3af",
        order: 999
      };

      return {
        id: key,
        label: mapping.label!,
        content: transformContent(value),
        technique: mapping.technique!,
        color: mapping.color!,
        order: mapping.order!,
        sfl: config?.contextSources?.find(s => s.id === key)?.sfl
      };
    })
    .sort((a, b) => a.order - b.order);

  return sources;
};

// Assemble full prompt from context sources
export const assembleFullPrompt = (sources: ContextSource[]): string => {
  return sources
    .map(source => `[${source.label}]\n${source.content}`)
    .join('\n\n---\n\n');
};
