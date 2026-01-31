import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { NavigationTab } from '../core/types';
import { SIDEBAR_DATA } from '../core/constants';
// Refactored Import
import { NetworkHeader } from '@ioi/ui';

interface DocsLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  toc?: React.ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const DocsLayout = ({ children, sidebar, toc, activeTab, onTabChange }: DocsLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100 font-sans selection:bg-cyan-500/20">
      
      {/* 1. Global Network Bar */}
      <NetworkHeader currentAppId="docs" />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-200 lg:translate-x-0
          top-24 /* Pushed down by NetworkHeader */
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar Header - Logo removed, just context title */}
          <div className="h-14 flex items-center px-4 border-b border-zinc-800 justify-between">
            <span className="font-bold text-white tracking-tight">Docs Portal</span>
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">v2.4</span>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100vh-3.5rem-2.25rem)]">
            {sidebar}
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 lg:pl-72 flex flex-col min-h-[calc(100vh-2.25rem)] pt-9">
          
          {/* App Header (Tabs & Search) */}
          <header className="h-19 mt-24 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden text-zinc-400">
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Navigation Tabs (Kernel, Swarm, DDK, API) */}
              <div className="hidden md:flex items-center gap-1">
                {Object.entries(SIDEBAR_DATA).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => onTabChange(key as NavigationTab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      activeTab === key 
                        ? 'bg-zinc-800 text-white' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search docs...</span>
              <kbd className="ml-2 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
            </button>
          </header>

          <main className="flex-1 w-full flex">
            <div className="flex-1 min-w-0 p-8 lg:p-12 xl:pr-8">
              {children}
            </div>
            
            {toc && (
              <div className="hidden xl:block w-72 shrink-0">
                {toc}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};