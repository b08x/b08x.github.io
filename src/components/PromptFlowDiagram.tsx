import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  PromptFlowDiagramProps,
  ContextSource,
  processYAMLToContextSources,
  assembleFullPrompt
} from '../types/prompt';

// ============================================================================
// HARDCODED EXAMPLE VIEW (Original Implementation)
// ============================================================================

interface HardcodedExampleProps {
  initialStep?: number;
}

const HardcodedExampleView: React.FC<HardcodedExampleProps> = ({ initialStep = 0 }) => {
  const [step, setStep] = useState(initialStep);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theme synchronization
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // CSS variables handle theme automatically
    });
    if (document.documentElement) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
    return () => observer.disconnect();
  }, []);

  const sketchyStyle = {
    borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
    boxShadow: '2px 3px 5px rgba(0,0,0,0.05)'
  };

  const nextStep = () => setStep((prev) => (prev < 5 ? prev + 1 : 0));

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '1024px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: isMobile ? 'var(--spacing-4)' : 'var(--spacing-6)',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        userSelect: 'none'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 'var(--spacing-4)' : 'var(--spacing-6)',
        alignItems: 'stretch',
        position: 'relative'
      }}>

        {/* LEFT COLUMN - CONTEXT INPUTS */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-4)',
          width: isMobile ? '100%' : '25%',
          justifyContent: 'center',
          zIndex: 10
        }}>

          {/* User Profile */}
          <div
            style={{
              ...sketchyStyle,
              border: '2px solid #3b82f6',
              borderRadius: sketchyStyle.borderRadius,
              boxShadow: sketchyStyle.boxShadow,
              padding: 'var(--spacing-3)',
              background: 'var(--background)',
              opacity: step >= 2 ? 1 : 0,
              transform: step >= 2 ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity 500ms, transform 500ms'
            }}
          >
            <h3 style={{
              fontWeight: 600,
              color: '#3b82f6',
              transform: 'rotate(-2deg)',
              marginBottom: 'var(--spacing-2)'
            }}>
              User Profile
            </h3>
            <p style={{
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              color: 'var(--foreground)',
              lineHeight: 1.5
            }}>
              Alex prefers electric vehicles, values{' '}
              <span style={{
                background: '#fef08a',
                padding: '0 0.25rem',
                color: '#000'
              }}>safety</span>{' '}
              and{' '}
              <span style={{
                background: '#fef08a',
                padding: '0 0.25rem',
                color: '#000'
              }}>efficiency</span>.
            </p>
          </div>

          {/* Memory */}
          <div
            style={{
              ...sketchyStyle,
              border: '2px solid #22c55e',
              borderRadius: sketchyStyle.borderRadius,
              boxShadow: sketchyStyle.boxShadow,
              padding: 'var(--spacing-3)',
              background: 'var(--background)',
              opacity: step >= 3 ? 1 : 0,
              transform: step >= 3 ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity 500ms 100ms, transform 500ms 100ms'
            }}
          >
            <h3 style={{
              fontWeight: 600,
              color: '#22c55e',
              transform: 'rotate(1deg)',
              marginBottom: 'var(--spacing-2)'
            }}>
              Memory
            </h3>
            <p style={{
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              color: 'var(--foreground)',
              lineHeight: 1.5
            }}>
              Alex said they want to buy a new car within{' '}
              <span style={{
                background: '#fef08a',
                padding: '0 0.25rem',
                color: '#000'
              }}>two months</span>.
            </p>
          </div>

          {/* Web Search */}
          <div
            style={{
              ...sketchyStyle,
              border: '2px solid #f97316',
              borderRadius: sketchyStyle.borderRadius,
              boxShadow: sketchyStyle.boxShadow,
              padding: 'var(--spacing-3)',
              background: 'var(--background)',
              opacity: step >= 4 ? 1 : 0,
              transform: step >= 4 ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity 500ms 200ms, transform 500ms 200ms'
            }}
          >
            <h3 style={{
              fontWeight: 600,
              color: '#f97316',
              transform: 'rotate(-1deg)',
              marginBottom: 'var(--spacing-2)'
            }}>
              Web
            </h3>
            <p style={{
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              color: 'var(--foreground)',
              lineHeight: 1.5
            }}>
              Model 3 scored{' '}
              <span style={{
                background: '#fef08a',
                padding: '0 0.25rem',
                color: '#000'
              }}>82/100</span>{' '}
              in reliability.
            </p>
          </div>

          {/* RAG */}
          <div
            style={{
              ...sketchyStyle,
              border: '2px solid #a855f7',
              borderRadius: sketchyStyle.borderRadius,
              boxShadow: sketchyStyle.boxShadow,
              padding: 'var(--spacing-3)',
              background: 'var(--background)',
              opacity: step >= 5 ? 1 : 0,
              transform: step >= 5 ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity 500ms 300ms, transform 500ms 300ms'
            }}
          >
            <h3 style={{
              fontWeight: 600,
              color: '#a855f7',
              transform: 'rotate(2deg)',
              marginBottom: 'var(--spacing-2)'
            }}>
              RAG / MCP
            </h3>
            <p style={{
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              color: 'var(--foreground)',
              lineHeight: 1.5
            }}>
              Efficiency DB: Model 3 averages{' '}
              <span style={{
                background: '#fef08a',
                padding: '0 0.25rem',
                color: '#000'
              }}>4.1 mi/kWh</span>.
            </p>
          </div>
        </div>

        {/* MIDDLE COLUMN - PROMPT ENGINEERING WINDOW */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-2)',
            fontWeight: 600,
            fontSize: '1.25rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: 0.8,
            color: 'var(--foreground)'
          }}>
            Context Engineering
          </div>

          <div
            style={{
              ...sketchyStyle,
              border: '3px solid var(--foreground)',
              borderRadius: sketchyStyle.borderRadius,
              boxShadow: sketchyStyle.boxShadow,
              minHeight: '400px',
              padding: 'var(--spacing-6)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--background)'
            }}
          >
            <div style={{
              borderBottom: '2px dashed var(--border)',
              paddingBottom: 'var(--spacing-2)',
              marginBottom: 'var(--spacing-4)',
              textAlign: 'center',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--foreground)'
            }}>
              Prompt
            </div>

            {/* The Constructed Prompt Text */}
            <div style={{
              fontSize: '1.125rem',
              lineHeight: 1.8,
              fontWeight: 500,
              position: 'relative',
              color: 'var(--foreground)'
            }}>
              <p style={{ margin: 0 }}>
                You are an{' '}
                <span style={{
                  background: '#fef08a',
                  padding: '0 0.25rem',
                  color: '#000',
                  opacity: step >= 1 ? 1 : 0,
                  transition: 'opacity 300ms'
                }}>honest</span>{' '}
                assistant helping a user named{' '}
                <span style={{
                  padding: '0 0.25rem',
                  marginLeft: '0.25rem',
                  transition: 'background 500ms, color 500ms',
                  background: step >= 2 ? '#dbeafe' : 'transparent',
                  color: step >= 2 ? '#1e40af' : 'inherit',
                  borderRadius: '2px'
                }}>
                  Alex
                </span>.
                Recommend the{' '}
                <span style={{
                  background: '#fef08a',
                  padding: '0 0.25rem',
                  marginLeft: '0.25rem',
                  color: '#000',
                  opacity: step >= 1 ? 1 : 0,
                  transition: 'opacity 300ms'
                }}>best car</span>{' '}
                for Alex and{' '}
                <span style={{
                  background: '#fef08a',
                  padding: '0 0.25rem',
                  marginLeft: '0.25rem',
                  color: '#000',
                  opacity: step >= 1 ? 1 : 0,
                  transition: 'opacity 300ms'
                }}>explain why</span>.
              </p>

              {/* Injected Context Area */}
              <div style={{
                marginTop: 'var(--spacing-6)',
                padding: 'var(--spacing-4)',
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                opacity: step >= 2 ? 1 : 0,
                transition: 'opacity 500ms',
                background: 'var(--surface)'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--spacing-2)',
                  fontWeight: 600,
                  letterSpacing: '0.05em'
                }}>
                  Injected Context:
                </p>

                {step >= 2 && (
                  <p style={{
                    color: '#3b82f6',
                    marginBottom: 'var(--spacing-2)',
                    fontSize: '0.875rem',
                    animation: 'fadeInLeft 500ms'
                  }}>
                    [Profile]: Alex prefers EV, values safety & efficiency.
                  </p>
                )}
                {step >= 3 && (
                  <p style={{
                    color: '#22c55e',
                    marginBottom: 'var(--spacing-2)',
                    fontSize: '0.875rem',
                    animation: 'fadeInLeft 500ms'
                  }}>
                    [Memory]: Timeline: 2 months.
                  </p>
                )}
                {step >= 4 && (
                  <p style={{
                    color: '#f97316',
                    marginBottom: 'var(--spacing-2)',
                    fontSize: '0.875rem',
                    animation: 'fadeInLeft 500ms'
                  }}>
                    [Web]: Model 3 Reliability: 82/100.
                  </p>
                )}
                {step >= 5 && (
                  <p style={{
                    color: '#a855f7',
                    marginBottom: 0,
                    fontSize: '0.875rem',
                    animation: 'fadeInLeft 500ms'
                  }}>
                    [RAG]: Efficiency: 4.1 mi/kWh.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - LLM */}
        <div style={{
          width: isMobile ? '100%' : '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10
        }}>
          <div
            style={{
              ...sketchyStyle,
              border: '3px solid var(--foreground)',
              borderRadius: sketchyStyle.borderRadius,
              boxShadow: sketchyStyle.boxShadow,
              height: isMobile ? '100px' : '264px',
              width: '100%',
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-4)',
              background: 'var(--surface)'
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>L</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>L</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>M</span>
          </div>
        </div>

        {/* SVG OVERLAYS (Arrows) */}
        {!isMobile && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
              zIndex: 0,
              overflow: 'visible'
            }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--foreground)" opacity="0.5" />
              </marker>
            </defs>

            {/* Arrow: Profile -> Prompt */}
            {step >= 2 && (
              <path
                d="M 25 20 Q 35 20 40 40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.5"
                markerEnd="url(#arrowhead)"
                style={{ animation: 'drawLine 800ms' }}
              />
            )}

            {/* Arrow: Prompt -> LLM */}
            <path
              d="M 75 50 L 85 50"
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="0.8"
              markerEnd="url(#arrowhead)"
              opacity="0.3"
            />
          </svg>
        )}

      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'var(--spacing-6)',
        gap: 'var(--spacing-4)',
        alignItems: 'center'
      }}>
        <button
          onClick={nextStep}
          style={{
            padding: 'var(--spacing-2) var(--spacing-6)',
            borderRadius: '9999px',
            background: 'var(--accent)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 150ms',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {step === 5 ? 'Reset Flow' : 'Inject Context'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {[0, 1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              style={{
                height: '8px',
                width: '8px',
                borderRadius: '50%',
                background: step >= s ? 'var(--accent)' : 'var(--border)',
                transition: 'background 300ms'
              }}
            />
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes drawLine {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// YAML-DRIVEN VIEW (New Implementation)
// ============================================================================

const YAMLDrivenView: React.FC<PromptFlowDiagramProps> = (props) => {
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process YAML data into context sources
  const contextSources = useMemo(() => processYAMLToContextSources(
    props.yamlData,
    props.visualizationConfig
  ), [props.yamlData, props.visualizationConfig]);

  const assembledPrompt = useMemo(() => assembleFullPrompt(contextSources), [contextSources]);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theme synchronization
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // CSS variables handle theme automatically
    });
    if (document.documentElement) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
    return () => observer.disconnect();
  }, []);

  const sketchyStyle = {
    borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
    boxShadow: '2px 3px 5px rgba(0,0,0,0.05)'
  };

  const nextStep = () => setStep((prev) => (prev < contextSources.length + 1 ? prev + 1 : 0));

  const maxSteps = contextSources.length + 1; // +1 for the initial step

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: isMobile ? 'var(--spacing-4)' : 'var(--spacing-6)',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none'
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 'var(--spacing-6)',
        alignItems: 'start',
        position: 'relative'
      }}>

        {/* LEFT COLUMN - CONTEXT SOURCES */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-4)',
          gridColumn: isMobile ? '1' : '1',
        }}>
          {contextSources.map((source, index) => (
            <div
              key={source.id}
              style={{
                ...sketchyStyle,
                border: `2px solid ${source.color}`,
                borderRadius: sketchyStyle.borderRadius,
                boxShadow: sketchyStyle.boxShadow,
                padding: 'var(--spacing-3)',
                background: 'var(--background)',
                opacity: step > index ? 1 : 0,
                transform: step > index ? 'translateX(0)' : 'translateX(-20px)',
                transition: `opacity 500ms ${index * 100}ms, transform 500ms ${index * 100}ms`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--spacing-2)'
              }}>
                <h3 style={{
                  fontWeight: 600,
                  color: source.color,
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  {source.label}
                </h3>
                {props.showTechniques !== false && (
                  <div
                    className="technique-badge"
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      color: 'white',
                      backgroundColor: source.color,
                      cursor: 'help'
                    }}
                    onMouseEnter={() => setHoveredSource(source.id)}
                    onMouseLeave={() => setHoveredSource(null)}
                  >
                    {source.technique.name}

                    {/* Tooltip */}
                    {hoveredSource === source.id && (
                      <div
                        className="sfl-tooltip"
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          marginBottom: '0.5rem',
                          padding: '0.75rem',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                          minWidth: '200px',
                          maxWidth: '300px',
                          zIndex: 50,
                          fontSize: '0.75rem',
                          fontWeight: 'normal',
                          color: 'var(--foreground)',
                          whiteSpace: 'normal',
                          pointerEvents: 'none'
                        }}
                      >
                        <p style={{ margin: '0.25rem 0' }}>
                          <strong style={{ color: 'var(--accent)' }}>Technique:</strong> {source.technique.description}
                        </p>
                        {source.sfl && (
                          <>
                            {source.sfl.field && (
                              <p style={{ margin: '0.25rem 0' }}>
                                <strong style={{ color: 'var(--accent)' }}>Field:</strong> {source.sfl.field.topic}
                              </p>
                            )}
                            {source.sfl.tenor && (
                              <p style={{ margin: '0.25rem 0' }}>
                                <strong style={{ color: 'var(--accent)' }}>Tenor:</strong> {source.sfl.tenor.aiPersona}
                              </p>
                            )}
                            {source.sfl.mode && (
                              <p style={{ margin: '0.25rem 0' }}>
                                <strong style={{ color: 'var(--accent)' }}>Mode:</strong> {source.sfl.mode.outputFormat}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p style={{
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                color: 'var(--foreground)',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {source.content}
              </p>
            </div>
          ))}
        </div>

        {/* MIDDLE COLUMN - ASSEMBLED PROMPT WINDOW */}
        <div style={{
          gridColumn: isMobile ? '1' : '2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-4)',
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            opacity: 0.8,
            color: 'var(--foreground)'
          }}>
            Assembled System Prompt
          </div>

          <div
            className="assembled-prompt-window"
            style={{
              ...sketchyStyle,
              border: '3px solid var(--foreground)',
              borderRadius: sketchyStyle.borderRadius,
              boxShadow: sketchyStyle.boxShadow,
              minHeight: '500px',
              maxHeight: '700px',
              padding: 'var(--spacing-4)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--background)',
              overflow: 'hidden'
            }}
          >
            <div style={{
              borderBottom: '2px dashed var(--border)',
              paddingBottom: 'var(--spacing-2)',
              marginBottom: 'var(--spacing-3)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--foreground)'
            }}>
              {props.yamlData?.name || 'System Prompt'}
            </div>

            <div
              className="prompt-content"
              style={{
                flex: 1,
                overflow: 'auto'
              }}
            >
              {step === 0 ? (
                <p style={{
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  marginTop: 'var(--spacing-8)'
                }}>
                  Click "Inject Context" to build the prompt...
                </p>
              ) : (
                <pre
                  className="assembled-text"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    margin: 0,
                    color: 'var(--foreground)'
                  }}
                >
                  {assembleFullPrompt(contextSources.slice(0, step))}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - LLM */}
        <div style={{
          gridColumn: isMobile ? '1' : '3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: isMobile ? 0 : '48px' // Align with "Assembled" title
        }}>
          <div
            style={{
              ...sketchyStyle,
              border: '3px solid var(--foreground)',
              borderRadius: sketchyStyle.borderRadius,
              boxShadow: sketchyStyle.boxShadow,
              height: isMobile ? '100px' : '200px',
              width: isMobile ? '100%' : '120px',
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-2)',
              background: 'var(--surface)',
              opacity: step > 0 ? 1 : 0.3,
              transition: 'opacity 500ms'
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--foreground)' }}>L</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--foreground)' }}>L</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--foreground)' }}>M</span>
          </div>
        </div>

      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'var(--spacing-6)',
        gap: 'var(--spacing-4)',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={nextStep}
          style={{
            padding: 'var(--spacing-2) var(--spacing-6)',
            borderRadius: '9999px',
            background: 'var(--accent)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 150ms',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {step === maxSteps - 1 ? 'Reset Flow' : 'Inject Context'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {Array.from({ length: maxSteps }, (_, i) => (
            <div
              key={i}
              style={{
                height: '8px',
                width: '8px',
                borderRadius: '50%',
                background: step >= i ? 'var(--accent)' : 'var(--border)',
                transition: 'background 300ms'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ROUTER COMPONENT (Main Export)
// ============================================================================

const PromptFlowDiagram: React.FC<PromptFlowDiagramProps> = (props) => {
  const isYAMLMode = !!(props.yamlData || props.visualizationConfig);
  return isYAMLMode
    ? <YAMLDrivenView {...props} />
    : <HardcodedExampleView initialStep={props.initialStep} />;
};

export default PromptFlowDiagram;
