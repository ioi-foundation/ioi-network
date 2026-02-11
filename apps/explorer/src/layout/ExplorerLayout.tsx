import React from 'react';
import { NetworkHeader, MegaMenu } from '@ioi/ui';
import { Search } from 'lucide-react';
import { useState } from 'react';

export const ExplorerLayout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100">
      <NetworkHeader currentAppId="explorer" className="fixed top-0 w-full z-50" />
      <MegaMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} currentApp="explorer" />
      
      {/* Sub-header / Search */}
      <div className="mt-9 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-9 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight">IOI SCAN</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              Mainnet Beta
            </span>
          </div>

          <div className="flex-1 max-w-lg relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-sm placeholder-zinc-500 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              placeholder="Search by Address, Tx Hash, or Block Height..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-zinc-600 text-xs border border-zinc-800 rounded px-1.5 py-0.5">/</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-600">
        IOI Network Explorer &copy; 2026
      </footer>
    </div>
  );
};
