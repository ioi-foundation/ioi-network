// File: src/features/content/SourceStatus.tsx
import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, FileCode, GitBranch, ChevronDown, RefreshCw } from 'lucide-react';

interface SourceStatusProps {
  status: 'synced' | 'drift' | 'verifying' | 'unknown';
  path: string;
  repo: string;
  missingSymbols?: string[];
  onViewSource?: () => void;
}

export const SourceStatus = ({ status, path, repo, missingSymbols = [], onViewSource }: SourceStatusProps) => {
  const [expanded, setExpanded] = useState(false);
  const isDrift = status === 'drift';
  
  return (
    <div className={`
      mb-10 rounded-lg border overflow-hidden transition-all duration-300
      ${isDrift ? 'border-rose-500/30 bg-rose-500/5' : 'border-zinc-800 bg-zinc-900/30'}
    `}>
      {/* Header */}
      <div className={`
        px-4 py-3 border-b flex items-center justify-between
        ${isDrift ? 'border-rose-500/20 bg-rose-500/10' : 'border-zinc-800 bg-zinc-900/50'}
      `}>
        <div className="flex items-center gap-2">
          <FileCode className={`w-4 h-4 ${isDrift ? 'text-rose-400' : 'text-zinc-400'}`} />
          <span className={`text-xs font-medium ${isDrift ? 'text-rose-200' : 'text-zinc-300'}`}>
            Source Mapping
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status === 'verifying' ? (
             <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase tracking-wide">
               <RefreshCw className="w-3 h-3 animate-spin" /> Verifying
             </span>
          ) : isDrift ? (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20 uppercase tracking-wide hover:bg-rose-500/30 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" /> Drift Detected
              <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono">
            <GitBranch className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-500">{repo}</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">{path}</span>
          </div>
          
          {onViewSource && (
            <button 
              onClick={onViewSource}
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors"
            >
              View Code
            </button>
          )}
        </div>

        {/* Drift Details - The HUD */}
        {isDrift && expanded && missingSymbols.length > 0 && (
          <div className="mt-4 pt-4 border-t border-rose-500/20 animate-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-rose-200 font-medium mb-1">Documentation Outdated</p>
                <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                  The following kernel definitions referenced in this documentation were not found in the source file.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSymbols.map(sym => (
                    <code key={sym} className="text-[10px] font-mono text-rose-300 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/50">
                      {sym}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};