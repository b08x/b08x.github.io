import * as React from "react";

/** Switch — toggle with a coral "on" track. */
export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  /** Optional trailing label. */
  label?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Switch(props: SwitchProps): JSX.Element;
