export interface WikiSidebarTreeNode {
  key: string;
  label: string | null;
  type: WikiSidebarTreeNodeType;
  icon: string | null;
  uri: string | null;
  children?: WikiSidebarTreeNode[];
}

export enum WikiSidebarTreeNodeType {
  TEXT,
  HEADER,
  INTERNAL_URL,
  EXTERNAL_URL,
}