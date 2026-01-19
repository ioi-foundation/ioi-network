import React, { useState, useEffect } from 'react';
import { Wifi, Activity, Zap, Server, GitCommit, Database } from 'lucide-react';

export const StatusBar = () => {
  // Telemetry Simulation (Moved from Header.tsx)
  const [blockHeight, setBlockHeight] = useState(12940221);
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setBlockHeight(h => h + 1);
      setLatency(Math.floor(Math.random() * (24 - 8) + 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-7 bg-ioi-navy border-t border-ioi-border z-[60] flex items-center justify-between px-3 text-[10px] font-mono text-gray-500 select-none bg-opacity-95 backdrop-blur">
      {/* Left: Connection Details */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 hover:text-ioi-cyan cursor-help transition-colors">
          <Server className="w-3 h-3" />
          <span className="hidden sm:inline">Mainnet-Beta</span>
          <span className="sm:hidden">Mainnet</span>
        </div>
        
        <div className={`flex items-center gap-1.5 ${latency < 20 ? 'text-green-400' : 'text-amber-400'}`}>
          <Wifi className="w-3 h-3" />
          <span>{latency}ms</span>
        </div>

        <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">Node: 0x8f...2a1</span>
        </div>
      </div>

      {/* Right: Network Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-ioi-amber" title="Gas Price">
           <Zap className="w-3 h-3" />
           <span>4 gwei</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-ioi-cyan">
           <GitCommit className="w-3 h-3" />
           <span>#{blockHeight.toLocaleString()}</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 text-ioi-muted">
           <Activity className="w-3 h-3" />
           <span>v2.4.0-rc1</span>
        </div>
      </div>
    </footer>
  );
};