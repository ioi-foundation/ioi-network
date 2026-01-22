import React from 'react';
import { Agent } from '../../core/types';

interface AgentSwarmViewProps {
  rootAgent: Agent;
}

const HierarchyNode = ({ role, name, bond, isRoot, status }: { 
  role: string; name: string; bond: string; isRoot?: boolean; status?: string 
}) => (
  <div className={`relative p-3 rounded-lg border transition-all ${
    isRoot 
      ? 'bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
      : 'bg-zinc-900 border-zinc-800'
  } w-48 text-center`}>
    
    <div className="flex justify-between items-center mb-2">
      <span className="text-[9px] uppercase tracking-wide text-zinc-500">{role}</span>
      {status === 'Slashed' && (
        <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">SLASHED</span>
      )}
    </div>
    
    <div className="text-sm font-medium text-white truncate">{name}</div>
    
    <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 bg-zinc-950/50 rounded px-2 py-1.5 border border-zinc-800/50">
      <span>Bond</span>
      <span className={isRoot ? 'text-cyan-400' : 'text-zinc-300'}>${bond}</span>
    </div>
  </div>
);

export const AgentSwarmView = ({ rootAgent }: AgentSwarmViewProps) => {
  // In a real app, this data would come from the Delegation Graph Ledger
  // For now, we simulate workers based on the root agent's risk profile
  const workers = [
    { role: 'Data Fetcher', name: 'Oracle Connect v1', bond: '2,500' },
    { role: 'Reasoning', name: 'Llama-3-70b-Instruct', bond: '10,000' },
    { role: 'Execution', name: 'SafeWallet Signer', bond: '15,000' }
  ];

  return (
    <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950/50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Root (The Planner) */}
        <HierarchyNode 
          role="Planner Node (Manager)" 
          name={rootAgent.name} 
          bond={(rootAgent.totalStaked / 100).toLocaleString()} 
          isRoot
          status={rootAgent.status}
        />
        
        {/* Connection Lines */}
        <div className="relative h-6 w-full max-w-[280px]">
          {/* Vertical Stem */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-zinc-700" />
          {/* Horizontal Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-700" />
          {/* Vertical Connectors to children */}
          <div className="absolute bottom-0 left-0 h-2 w-px bg-zinc-700 translate-y-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-px bg-zinc-700 translate-y-full" />
          <div className="absolute bottom-0 right-0 h-2 w-px bg-zinc-700 translate-y-full" />
        </div>
        
        {/* Workers */}
        <div className="flex gap-4 pt-2">
          {workers.map((worker, idx) => (
            <HierarchyNode 
              key={idx}
              role={`Worker ${idx + 1}`} 
              name={worker.name} 
              bond={worker.bond} 
            />
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex items-start gap-2 bg-blue-500/5 border border-blue-500/10 p-3 rounded text-[11px] text-blue-200">
        <div className="w-4 h-4 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">i</div>
        <p>
          Recursive Liability Active: If any Worker commits a fault (e.g., Equivocation), 
          <span className="font-bold text-white"> {rootAgent.name}</span>'s bond is slashed first to compensate the user.
        </p>
      </div>
    </div>
  );
};
