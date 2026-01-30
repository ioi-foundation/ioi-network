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
import { Explore } from './components/Explore';
import { Subsystems } from './components/Subsystems';

export default function RootApp() {
  return (
    <div className='min-h-screen bg-black pb-40'>
      <NetworkHeader currentAppId="hub" />
      <MainNetStatus />
      <Hero />
      <div className="bg-black w-full max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        <FadeIn delay={100}>
          <StatTicker />
        </FadeIn>
        <FadeIn delay={200}>
          <Explore />
        </FadeIn>
        <FadeIn delay={300}>
          <Subsystems />
        </FadeIn>
      </div>
     
    </div>

  );
}