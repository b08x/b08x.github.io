import * as React from "react";

/** CodePanel — inset terminal-flavored command/output block. */
export interface CodePanelProps {
  children?: React.ReactNode;
  /** Language chip (e.g. "bash", "json"). */
  lang?: string;
  /** Filename shown in the header. */
  filename?: string;
  /** Show the copy button. @default true */
  copy?: boolean;
  style?: React.CSSProperties;
}

export function CodePanel(props: CodePanelProps): JSX.Element;
