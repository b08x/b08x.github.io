---
name: Paper & Ink
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f1eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#49463f'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0e9'
  outline: '#7b776e'
  outline-variant: '#cbc6bc'
  surface-tint: '#615e58'
  primary: '#171611'
  on-primary: '#ffffff'
  primary-container: '#2c2a25'
  on-primary-container: '#95918a'
  inverse-primary: '#cbc6be'
  secondary: '#a03e3d'
  on-secondary: '#ffffff'
  secondary-container: '#fd8581'
  on-secondary-container: '#741d1f'
  tertiary: '#0f1900'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f2f00'
  on-tertiary-container: '#819a51'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e7e2da'
  primary-fixed-dim: '#cbc6be'
  on-primary-fixed: '#1d1b17'
  on-primary-fixed-variant: '#494641'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3af'
  on-secondary-fixed: '#410005'
  on-secondary-fixed-variant: '#812727'
  tertiary-fixed: '#d1ed9a'
  tertiary-fixed-dim: '#b5d081'
  on-tertiary-fixed: '#131f00'
  on-tertiary-fixed-variant: '#384d0c'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
typography:
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Merriweather
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Merriweather
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Merriweather
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1280px
---

## Brand & Style
The design system is rooted in the aesthetic of high-density technical documentation and physical printed matter. It evokes the feeling of architectural blueprints, academic journals, and precision engineering manuals. The target audience includes developers, engineers, and researchers who value information density, clarity, and a "low-glare" intellectual environment.

The style is a blend of **Minimalism** and **Technical Brutalism**. It rejects modern digital trends like blurs, glows, and organic shadows in favor of "ink-on-paper" constraints. The UI should feel intentional, structured, and permanent. Layouts are driven by utility and logic, using thin borders and solid fills to define space rather than depth or lighting effects.

## Colors
The palette is inspired by natural pigments and archival materials. 
- **Base Surface:** The primary background uses a light beige/cream (#F4F1EA) to mimic the warmth of unbleached paper.
- **Ink:** All primary text and structural lines use a dark charcoal (#2C2A25), providing high contrast without the harshness of pure black.
- **Accents:** Muted tones (Maroon, Olive, Teal, and Earth Brown) are used strictly for status, categorization, and call-to-action elements. 
- **Functional States:** Use solid color fills for "on" states and thin ink-line borders for "off" or neutral states. Never use gradients; transitions should be instantaneous or strictly stepped.

## Typography
This design system employs a three-tier typographic hierarchy to differentiate between structure, content, and interface.
- **Headers (Monospace):** Used for titles, section headers, and data points. It reinforces the technical, "built" nature of the interface.
- **Body Content (Serif):** Used for long-form reading and descriptive text, providing high legibility and a classic, editorial feel.
- **UI Labels (Sans-Serif):** Used for buttons, navigation, and micro-copy. These are kept small and utilitarian to stay out of the way of the content.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy, mirroring a printed page. 
- **Grid:** A 12-column grid system for desktop, 6-column for tablet, and 2-column for mobile.
- **Density:** High information density is encouraged. Use the 4px base unit to tighten margins between related data points.
- **Borders as Dividers:** Use 1px solid borders in the primary text color (#2C2A25) to separate logical sections. Avoid using whitespace alone to define large sections; use explicit horizontal rules (HR) to mimic document breaks.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Framing**, not shadows.
- **Surfaces:** All elements sit on the same flat plane. To show "elevation" or focus, use a slight color shift in the background (e.g., a slightly darker cream) or a thicker 2px border.
- **Overlays:** Modals and menus should use a solid 1px or 2px border and a non-transparent background. To separate them from the content below, use a solid "block shadow" (a solid offset rectangle) if necessary, but prefer a simple high-contrast border.
- **No Blurs:** Gaussian blurs or backdrop filters are strictly prohibited.

## Shapes
The shape language is strictly **Sharp (0px)**. 
Every element—buttons, input fields, cards, and tags—must have 90-degree corners. This reinforces the "printed" and "technical" aesthetic. The only exception is for iconography where circles are required for functional clarity (e.g., radio buttons).

## Components
- **Buttons:** Rectangular with 1px borders. Primary buttons use a solid fill of the Accent Maroon or Teal with the Paper background color for text. Secondary buttons use a transparent background with an Ink border and text.
- **Inputs:** 1px Ink border on all four sides. Active state uses a 2px border or a very subtle fill change. Labels sit strictly above the input in the Monospace font.
- **Chips/Tags:** Solid fills using the accent palette with small Monospace labels. No rounded corners.
- **Lists:** Separated by 1px horizontal lines. High density, minimal vertical padding.
- **Cards:** No shadows. Defined by a 1px Ink border. Header sections of cards are separated by a horizontal rule.
- **Checkboxes/Radios:** Checkboxes are sharp squares. Radio buttons are the only circular elements allowed in the UI, styled with a thick 2px Ink border when selected.
- **Data Tables:** Heavy use of vertical and horizontal lines (the "Grid" look). Header rows should have a solid Ink background with Paper-colored text.