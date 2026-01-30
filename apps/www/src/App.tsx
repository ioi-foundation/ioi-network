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
import { StatTicker } from './components/StatTicker';
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


export default function RootApp() {
  return (
    <div className='min-h-screen bg-black'>
      <NetworkHeader currentAppId="hub" />
      <MainNetStatus />
      <Hero />
      <div className="bg-black w-full max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        <StatTicker />
      </div>
    </div>
  );
}