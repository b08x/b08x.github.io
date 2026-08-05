import * as React from "react";

/**
 * Badge — small uppercase status pill in the editor status palette.
 */
export interface BadgeProps {
  children?: React.ReactNode;
  /** Semantic hue. @default "neutral" */
  tone?: "neutral" | "info" | "accent" | "success" | "question" | "warning" | "danger" | "special" | "coral";
  /** Filled vs tinted-soft. @default false */
  solid?: boolean;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
