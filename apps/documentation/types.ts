
// Import React to ensure the React namespace is available for type definitions
import React from 'react';

export interface SourceConfig {
  repo: 'kernel' | 'swarm' | 'ddk';
  path: string;
  branch?: string;
}

export interface DocItem {
  id: string;
  label: string;
  source?: SourceConfig;
  type: 'doc' | 'category';
  items?: DocItem[];
  description?: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  items: DocItem[];
  icon: React.ReactNode;
  color: string;
}

export enum NavigationTab {
  SWARM = 'frameworkSidebar',
  KERNEL = 'kernelSidebar',
  DDK = 'ddkSidebar',
  API = 'apiSidebar'
}
