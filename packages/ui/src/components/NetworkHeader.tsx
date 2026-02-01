import React from 'react';
import { IOI_APPS, getAppUrl, NetworkAppId } from '../config';

// IOI Logo Component (Inlined for shared package portability)
const IOILogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
  </svg>
);

export interface NetworkHeaderProps {
  currentAppId: NetworkAppId;
  className?: string;
}

export const NetworkHeader = ({ currentAppId, className = '' }: NetworkHeaderProps) => {
  return (
    <nav className={`h-9 bg-black border-b border-zinc-800 flex items-center justify-between px-4 z-[60] fixed top-0 w-full ${className}`}>
      {/* Left: Network Logo & App Switcher */}
      <div className="flex items-center gap-6">
        {/* Master Brand */}
        <a href={getAppUrl(IOI_APPS[0])} className="flex items-center gap-2 group">
          <div className="text-zinc-400 group-hover:text-white transition-colors">
            <IOILogo />
          </div>
          <span className="text-xs font-bold text-zinc-300 tracking-tight group-hover:text-white transition-colors">
            IOI NETWORK
          </span>
        </a>

        {/* Divider */}
        <div className="h-3 w-px bg-zinc-800" />

        {/* App Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {IOI_APPS.map((app) => {
            // Skip the "Gateway" (www) in the quick switcher, show specific apps
            if (app.id === 'www') return null;
            
            const isActive = app.id === currentAppId;
            const Icon = app.icon;
            
            return (
              <a
                key={app.id}
                href={getAppUrl(app)}
                className={`
                  flex items-center gap-2 px-3 py-1 rounded text-[11px] font-medium transition-all
                  ${isActive 
                    ? 'text-white bg-zinc-900 shadow-sm ring-1 ring-zinc-800' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}
                `}
              >
                <span className={isActive ? 'text-cyan-400' : 'opacity-70'}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {app.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* Right: Global Utilities */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mainnet: <span className="text-zinc-300">Operational</span></span>
        </div>

        <a 
          href="https://github.com/ioi-network" 
          target="_blank" 
          rel="noreferrer"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <span className="sr-only">GitHub</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </nav>
  );
};