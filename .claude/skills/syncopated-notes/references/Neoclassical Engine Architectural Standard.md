# **Neoclassical Engine: Architectural Standard**

**Version:** 2.0 (Strict Enforcement)

**Core Paradigm:** Skeuomorphic Technical Engineering / "Glass Box" Transparency.

This is the single source of truth for the Neoclassical Blueprint aesthetic. Do not inline hex codes. Do not invent new gradients. All downstream React components and CSS-in-JS modules must pull from these exact root variables.

## **1\. CSS Root Variables (The Paint)**

Inject this directly into your :root or theme provider.

:root {  
  /\* Surface & Canvas \*/  
  \--canvas-vellum: \#F6F4EB; /\* The non-negotiable paper background \*/  
  \--surface-transparent: transparent; /\* Glass-box component backgrounds \*/  
    
  /\* Primary Linework \*/  
  \--stroke-graphite: \#1A2A3A; /\* Replaces \#000000 for all structural borders/text \*/  
  \--stroke-muted: \#6B685C; /\* Secondary borders, grid lines \*/

  /\* The Agentic Triad (Semantic Accents) \*/  
  \--agent-thesis: \#64748B;    /\* Muted Slate \- Ground Truth/Stability \*/  
  \--agent-antithesis: \#B91C1C; /\* Desaturated Crimson \- Conflict/Warning \*/  
  \--agent-synthesis: \#D29624;  /\* Golden Ochre \- Resolution/Primary Focal Action \*/  
    
  /\* Pipeline Accents \*/  
  \--routing-purple: \#6E62A6;   /\* Orchestrator/Gateway routing logic \*/  
  \--raw-green: \#A1B281;        /\* Preprocessing/Input handling \*/  
}

## **2\. Typography Stack (The Weight)**

This environment relies on a dual-engine typography stack. Do not cross-contaminate.

* **UI & Technical Labels (Sans-Serif):** Space Grotesk (Headers/Nodes) and Inter (Micro-copy/Tags).  
* **Prose & Reading Surface (Serif):** Literata (Titles/H1) and Merriweather (Body text).  
* **Data & Terminal (Monospace):** Fira Code (JSON, Cypher, Code blocks).

**Execution Matrix:**

* **\<PageTitle\>**: font-family: 'Literata', serif; font-size: 2rem; color: var(--stroke-graphite);  
* **\<NodeHeader\>**: font-family: 'Space Grotesk', sans-serif; font-size: 0.875rem; text-transform: uppercase;  
* **\<DocumentBody\>**: font-family: 'Merriweather', serif; line-height: 1.6; color: var(--stroke-graphite);

## **3\. Component Geometry (The Metal)**

Drop standard CSS box-shadows and border-radius. Everything is a drafted vector.

* **Containers:** Use an SVG wrapper or Rough.js. stroke: var(--stroke-graphite); stroke-width: 2px; fill: var(--canvas-vellum);  
* **Corner Overshoots:** Mandatory. Horizontal and vertical lines must mathematically intersect and extend 4px past the joint.  
* **Terminals:** The only exception to the light-mode rule. Background must be strictly \#0A0A0B with color: \#E4E4E7 to provide a localized high-contrast data viewport.

## **4\. Hard Constraints (Steve's Law)**

1. **The Multi-Accent Trap:** Never use more than one Triad color per component. If a module is running Thesis logic, it is Slate. Do not add Crimson unless it throws an error.  
2. **No Pure White:** \#FFFFFF is banned on the canvas. It burns the paper illusion.  
3. **Visible Construction:** Background grid must remain visible (z-index: 0). Set grid lines to var(--stroke-muted) at 0.15 opacity.