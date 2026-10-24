import * as React from "react";

/**
 * Button — Syncopated Notes primary action control.
 *
 * @startingPoint section="Core" subtitle="Action buttons — coral primary, IDE styling" viewport="700x120"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Leading icon node (e.g. an SVG). */
  icon?: React.ReactNode;
  /** Trailing icon node. */
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
