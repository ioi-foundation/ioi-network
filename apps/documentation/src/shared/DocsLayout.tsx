import React, { useState } from 'react';
import { BookOpen, Cpu, Layers, Terminal, ChevronRight, Search, Menu, Command } from 'lucide-react';

const NavSection = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{label}</h3>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const NavItem = ({ active, label, onClick, status }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-all ${
      active 
        ? 'bg-zinc-800 text-white font-medium' 
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
    }`}
  >
    <span>{label}</span>
    {status === 'drift' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
  </button>
);

export const DocsLayout = ({ children, sidebarContent }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-200 lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-14 flex items-center px-4 border-b border-zinc-800">
          <span className="font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center">
              <Terminal className="w-3 h-3 text-white" />
            </div>
            IOI Docs
          </span>
          <span className="ml-2 text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">v2.4</span>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-3.5rem)]">
          {sidebarContent}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-14 sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-zinc-400">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center text-xs text-zinc-500">
              <span>IOI Network</span>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-zinc-300">Kernel Core</span>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-cyan-400">Architecture</span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span>Search docs...</span>
            <kbd className="ml-2 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
          </button>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};