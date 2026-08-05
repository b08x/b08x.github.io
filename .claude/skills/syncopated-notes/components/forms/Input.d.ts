import * as React from "react";

/** Input — text field with coral focus ring; monospace value. */
export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Show danger border. @default false */
  invalid?: boolean;
  /** Leading adornment (icon / label). */
  prefix?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
