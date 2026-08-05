import * as React from "react";

/**
 * Callout — Obsidian-style admonition, the signature note component.
 *
 * @startingPoint section="Content" subtitle="Obsidian-style callout blocks" viewport="700x200"
 */
export interface CalloutProps {
  /** Semantic type → color + glyph. @default "note" */
  type?:
    | "note" | "info" | "todo"
    | "abstract" | "tldr"
    | "tip" | "important" | "success" | "done"
    | "question" | "faq"
    | "warning" | "caution"
    | "failure" | "error" | "bug"
    | "example" | "quote";
  /** Override the title (defaults to the type label). */
  title?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Callout(props: CalloutProps): JSX.Element;
