import React from 'react';
import { 
  LayoutGrid, 
  Scale, 
  BookOpen, 
  Terminal, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';

export type NetworkAppId = 'www' | 'hub' | 'governance' | 'docs' | 'explorer' | 'studio';

export interface NetworkApp {
  id: NetworkAppId;
  name: string;
  url: string;     // Production URL
  devUrl: string;  // Localhost URL
  icon: React.ElementType;
  description: string;
  status: 'live' | 'beta' | 'maintenance';
}

export const IOI_APPS: NetworkApp[] = [
  {
    id: 'www',
    name: 'Gateway',
    url: 'https://ioi.network',
    devUrl: 'http://localhost:3005',
    icon: Globe,
    description: 'Network Entry Point',
    status: 'live'
  },
  {
    id: 'hub',
    name: 'IOI Hub',
    url: 'https://app.ioi.network',
    devUrl: 'http://localhost:3000',
    icon: LayoutGrid,
    description: 'Dashboard & Wallet',
    status: 'beta'
  },
  {
    id: 'governance',
    name: 'Governance',
    url: 'https://gov.ioi.network',
    devUrl: 'http://localhost:3001',
    icon: Scale,
    description: 'DAO & Proposals',
    status: 'live'
  },
  {
    id: 'docs',
    name: 'Documentation',
    url: 'https://docs.ioi.network',
    devUrl: 'http://localhost:3002',
    icon: BookOpen,
    description: 'Kernel & SDK Refs',
    status: 'live'
  },
  {
    id: 'explorer',
    name: 'Block Explorer',
    url: 'https://scan.ioi.network',
    devUrl: 'http://localhost:3003',
    icon: Terminal,
    description: 'Transaction Ledger',
    status: 'live'
  },
  {
    id: 'studio',
    name: 'Agent Studio',
    url: 'https://studio.ioi.network',
    devUrl: 'http://localhost:3004',
    icon: ShieldCheck,
    description: 'Underwriting & Deploy',
    status: 'maintenance'
  }
];

/**
 * Returns the correct URL for an app based on the current environment.
 * Detects if running on localhost to return the devUrl.
 */
export const getAppUrl = (app: NetworkApp): string => {
  // SSR Guard
  if (typeof window === 'undefined') return app.url;

  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isDev ? app.devUrl : app.url;
};