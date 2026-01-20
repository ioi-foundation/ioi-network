import React from 'react';
import { ArrowRight } from 'lucide-react';
import { IOI_APPS, getAppUrl, NetworkAppId } from '../config';

export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentApp: NetworkAppId;
}

export const MegaMenu = ({ isOpen, onClose, currentApp }: MegaMenuProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4" 
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Menu Content */}
      <div 
        className="relative w-full max-w-4xl bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                </svg>
             </div>
             <div>
                <h2 className="text-lg font-bold text-white tracking-tight">IOI Network</h2>
                <p className="text-xs text-zinc-500 font-mono">Select a subsystem to launch</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="text-xs font-mono text-zinc-500 hover:text-white px-3 py-1.5 rounded border border-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            ESC
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {IOI_APPS.map((app) => {
            const isCurrent = app.id === currentApp;
            const Icon = app.icon;
            
            return (
              <a
                key={app.id}
                href={isCurrent ? '#' : getAppUrl(app)}
                onClick={isCurrent ? (e) => e.preventDefault() : undefined}
                className={`
                  group relative p-5 rounded-xl border transition-all duration-300
                  ${isCurrent 
                    ? 'bg-zinc-900/50 border-cyan-500/20 cursor-default ring-1 ring-cyan-500/20' 
                    : 'bg-zinc-900/20 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5'}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg transition-colors ${isCurrent ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-600'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                      {app.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
                      {app.status === 'beta' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>}
                      {app.status === 'maintenance' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                  </div>
                </div>
                
                <h3 className={`text-base font-semibold mb-1.5 flex items-center gap-2 ${isCurrent ? 'text-white' : 'text-zinc-200 group-hover:text-cyan-400 transition-colors'}`}>
                  {app.name}
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  {app.description}
                </p>

                {isCurrent && (
                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-cyan-500 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50">
                        CURRENT
                    </div>
                )}
              </a>
            );
          })}
        </div>

        <div className="px-8 py-4 bg-zinc-950 border-t border-zinc-800 text-[10px] text-zinc-600 font-mono flex justify-between items-center">
          <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-emerald-500 rounded-full"></span>Mainnet: Operational</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">Block: 12,940,221</span>
          </div>
          <div className="flex gap-4">
              <a href="#" className="hover:text-zinc-400 transition-colors">Support</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Status</a>
          </div>
        </div>
      </div>
    </div>
  );
};