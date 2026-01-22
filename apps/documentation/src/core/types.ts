import React from 'react';

export enum NavigationTab {
  SWARM = 'frameworkSidebar',
  KERNEL = 'kernelSidebar',
  DDK = 'ddkSidebar',
  API = 'apiSidebar'
}

export interface SourceConfig {
  repo: 'kernel' | 'swarm' | 'ddk' | 'api';
  path: string;
  branch?: string;
}

export interface DocItem {
  id: string;
  label: string;
  type: 'doc' | 'category';
  source?: SourceConfig;
  items?: DocItem[];
  description?: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  items: DocItem[];
}
