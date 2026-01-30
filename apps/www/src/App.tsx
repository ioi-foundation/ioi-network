import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Cpu, Zap, Layers } from 'lucide-react';
import {
  NetworkHeader,
  IOI_APPS,
  getAppUrl,
  FadeIn,
  Stagger,
  SkeletonCard
} from '@ioi/ui';

import { MainNetStatus } from './components/MainNetStatus';
import { Hero } from './components/Hero';
// --- Local Components ---

const AppCard = ({ app }: { app: typeof IOI_APPS[0] }) => {
  const Icon = app.icon;
  const isCurrent = app.id === 'www';

  if (isCurrent) return null; // Don't show the landing page link on the landing page

  return (
    <a
      href={getAppUrl(app)}
      className="group relative flex flex-col p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
          <Icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          {app.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />}
          {app.status === 'beta' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />}
          {app.status === 'maintenance' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />}
          <span className="text-[10px] font-mono uppercase text-zinc-500">{app.status}</span>
        </div>
      </div>

      <h3 className="text-lg font-medium text-white mb-2 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
        {app.name}
        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        {app.description}
      </p>
    </a>
  );
};

const StatTicker = () => {
  // Simulated live stats
  const [blockHeight, setBlockHeight] = useState(12940221);
  const [tps, setTps] = useState(1240);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(h => h + 1);
      setTps(prev => prev + Math.floor(Math.random() * 20) - 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Block Height', value: `#${blockHeight.toLocaleString()}`, icon: Layers },
    { label: 'Network TPS', value: tps.toLocaleString(), icon: Zap },
    { label: 'Active Agents', value: '14,203', icon: Cpu },
    { label: 'Global Nodes', value: '842', icon: Globe },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
      {stats.map((stat, i) => (
        <SkeletonCard key={i} className="flex items-center gap-4 !bg-zinc-950/50 backdrop-blur-sm">
          <stat.icon className="w-5 h-5 text-zinc-600" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{stat.label}</div>
            <div className="text-sm font-mono text-zinc-200">{stat.value}</div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
};

export default function RootApp() {
  return (
    <div className='min-h-screen bg-black'>
      <NetworkHeader currentAppId="hub" />
      <MainNetStatus />
      <Hero />
    </div>
  );
}