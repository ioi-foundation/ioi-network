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

// --- Local Components ---

const Hero = () => (
  <div className="relative pt-32 pb-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-900/50 text-cyan-400 text-xs font-mono mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        Mainnet Beta v2.4.0 is Live
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        The Infrastructure for <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Autonomous Agents
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        IOI Network is a decentralized physical infrastructure network (DePIN) optimized for 
        AI workloads. Deploy sovereign agents, underwrite computation, and govern the kernel.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <a 
          href={getAppUrl(IOI_APPS.find(a => a.id === 'hub')!)}
          className="px-8 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 transition-colors w-full sm:w-auto"
        >
          Launch Hub
        </a>
        <a 
          href={getAppUrl(IOI_APPS.find(a => a.id === 'docs')!)}
          className="px-8 py-3 bg-zinc-900 text-white font-medium border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors w-full sm:w-auto"
        >
          Read Documentation
        </a>
      </div>
    </div>
  </div>
);

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/20">
      {/* Shared Network Header */}
      <NetworkHeader currentAppId="www" />

      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="relative z-10 max-w-6xl mx-auto px-6">
        <Hero />
        
        <FadeIn delay={400}>
          <StatTicker />
        </FadeIn>

        <div className="mb-10">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6">Network Subsystems</h2>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerMs={100}>
            {IOI_APPS.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </Stagger>
        </div>

        <footer className="mt-24 pt-8 pb-12 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600 font-mono">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Status</a>
            <span>&copy; 2026 IOI Foundation</span>
          </div>
        </footer>
      </main>
    </div>
  );
}