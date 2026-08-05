import * as React from "react";

/**
 * Card — bordered surface container, border-first with minimal shadow.
 *
 * @startingPoint section="Core" subtitle="Surface container with header / footer" viewport="700x240"
 */
export interface CardProps {
  children?: React.ReactNode;
  /** Header title (monospace). */
  title?: React.ReactNode;
  /** Uppercase eyebrow above the title. */
  eyebrow?: React.ReactNode;
  /** Right-aligned header actions (e.g. IconButtons). */
  actions?: React.ReactNode;
  /** Muted footer region. */
  footer?: React.ReactNode;
  /** Add a coral left rule. @default false */
  accent?: boolean;
  /** Body padding. @default "md" */
  padding?: "none" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
