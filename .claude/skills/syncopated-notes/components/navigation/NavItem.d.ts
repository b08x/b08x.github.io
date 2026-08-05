import * as React from "react";

/** NavItem — sidebar / table-of-contents link with a coral active rule. */
export interface NavItemProps {
  children?: React.ReactNode;
  active?: boolean;
  /** Indent level for nested TOC entries. @default 0 */
  depth?: number;
  icon?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: React.CSSProperties;
}

export function NavItem(props: NavItemProps): JSX.Element;
