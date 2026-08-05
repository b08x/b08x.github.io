import * as React from "react";

/**
 * IconButton — square, icon-only control (e.g. theme toggle, copy).
 */
export interface IconButtonProps {
  children?: React.ReactNode;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** @default "secondary" */
  variant?: "secondary" | "ghost" | "solid";
  active?: boolean;
  disabled?: boolean;
  /** Accessible label + tooltip. */
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export function IconButton(props: IconButtonProps): JSX.Element;
