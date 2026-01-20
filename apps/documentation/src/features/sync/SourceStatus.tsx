import React from 'react';
import { CheckCircle2, AlertTriangle, FileCode, GitBranch, ArrowRight } from 'lucide-react';

export const SourceStatus = ({ status, path, repo }: { status: 'synced' | 'drift', path: string, repo: string }) => {
  const isDrift = status === 'drift';
  
  return (
    <div className={`
      mb-10 rounded-lg border overflow-hidden
      ${isDrift ? 'border-rose-500/30 bg-rose-500/5' : 'border-zinc-800 bg-zinc-900/30'}
    `}>
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
          {isDrift ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20 uppercase tracking-wide">
              <AlertTriangle className="w-3 h-3" /> Drift Detected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-xs font-mono mb-3">
          <GitBranch className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-zinc-500">{repo}</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">{path}</span>
        </div>

        {isDrift && (
          <div className="mt-3 p-3 rounded bg-zinc-950 border border-zinc-800">
            <p className="text-[11px] text-zinc-400 mb-2">
              The documentation references symbols that are missing in the latest kernel build:
            </p>
            <div className="flex gap-2">
              <code className="text-[10px] text-rose-300 bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-900/50">
                RotationState::InGracePeriod
              </code>
              <code className="text-[10px] text-rose-300 bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-900/50">
                IdentityHub::verify
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};