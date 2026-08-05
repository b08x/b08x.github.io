import * as React from "react";

/** Checkbox — square check, coral fill when set. */
export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
