import * as React from "react";

/** Select — native dropdown styled to match Input. */
export interface SelectOption { value: string; label: string; }
export interface SelectProps {
  value?: string;
  defaultValue?: string;
  /** String options or {value,label} objects. */
  options?: Array<string | SelectOption>;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style?: React.CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;
