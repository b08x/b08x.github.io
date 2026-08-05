import * as React from "react";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
}

/** Tabs — underline tab bar with a coral active indicator. */
export interface TabsProps {
  /** String values or {value,label,icon?,count?} objects. */
  tabs: Array<string | TabItem>;
  /** Controlled active value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

export function Tabs(props: TabsProps): JSX.Element;
