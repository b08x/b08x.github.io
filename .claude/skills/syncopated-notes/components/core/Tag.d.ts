import * as React from "react";

/**
 * Tag — monospace topic tag used on notes.
 */
export interface TagProps {
  children?: React.ReactNode;
  /** Show a leading "#". @default true */
  hash?: boolean;
  /** Selected state (cyan). @default false */
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  style?: React.CSSProperties;
}

export function Tag(props: TagProps): JSX.Element;
