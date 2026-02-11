import React, { useEffect, useState } from 'react';
import { 
  SkeletonCard, 
  FadeIn, 
  Stagger,
  SkeletonActivityRow
} from '@ioi/ui';
import { Box, Activity, Zap, Server } from 'lucide-react';
import { generateBlock, generateTx, Block, Transaction } from '../utils/mockData';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon: Icon }: any) => (
  <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
    <div>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-mono text-white">{value}</p>
    </div>
    <div className="p-2 rounded-md bg-zinc-800 text-zinc-400">
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

export const Dashboard = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState({ height: 12940221, tps: 1240 });

  // Simulate Live Chain Data
  useEffect(() => {
    // Initial Load
    const initBlocks = Array.from({ length: 10 }).map((_, i) => generateBlock(metrics.height - i));
    const initTxs = Array.from({ length: 10 }).map(() => generateTx());
    setBlocks(initBlocks);
    setTxs(initTxs);

    const interval = setInterval(() => {
      setMetrics(prev => ({
        height: prev.height + 1,
        tps: 1200 + Math.floor(Math.random() * 100)
      }));

      setBlocks(prev => [generateBlock(metrics.height + 1), ...prev.slice(0, 9)]);
      setTxs(prev => [generateTx(), ...prev.slice(0, 9)]);
    }, 2000); // New block every 2s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Block Height" value={'#' + metrics.height.toLocaleString()} icon={Box} />
          <StatCard label="TPS (Current)" value={metrics.tps.toLocaleString()} icon={Zap} />
          <StatCard label="Active Validators" value="84" icon={Server} />
          <StatCard label="24h Volume" value="42.8M IOI" icon={Activity} />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Blocks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Latest Blocks</h2>
            <Link to="/blocks" className="text-xs text-cyan-400 hover:text-cyan-300">View All</Link>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
             <div className="divide-y divide-zinc-800">
                {blocks.length === 0 ? (
                   Array.from({length:5}).map((_, i) => <div key={i} className="p-4"><SkeletonActivityRow /></div>)
                ) : (
                  blocks.map(block => (
                    <div key={block.height} className="p-4 flex items-center justify-between animate-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs">
                          Bk
                        </div>
                        <div>
                          <div className="text-sm font-mono text-cyan-400">#{block.height}</div>
                          <div className="text-xs text-zinc-500">{block.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{block.txCount} Txs</div>
                        <div className="text-xs text-zinc-500 font-mono">{block.proposer}</div>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        {/* Recent Txs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
            <Link to="/txs" className="text-xs text-cyan-400 hover:text-cyan-300">View All</Link>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
             <div className="divide-y divide-zinc-800">
                {txs.length === 0 ? (
                   Array.from({length:5}).map((_, i) => <div key={i} className="p-4"><SkeletonActivityRow /></div>)
                ) : (
                  txs.map(tx => (
                    <div key={tx.hash} className="p-4 flex items-center justify-between animate-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700 flex items-center justify-center text-zinc-400">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-mono text-cyan-400 truncate w-32">{tx.hash.substring(0, 16)}...</div>
                          <div className="text-xs text-zinc-500 flex gap-2">
                             <span>From {tx.from.substring(0,6)}...</span>
                             <span>To {tx.to.substring(0,6)}...</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-white">{tx.amount} IOI</div>
                        <div className="text-xs text-zinc-500">
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
