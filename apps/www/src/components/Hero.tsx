import { FadeIn, getAppUrl, IOI_APPS, Stagger } from "@ioi/ui";
import React from "react";
import Container from "../assets/Container.svg";
import FormatLine from "../assets/Container-R.svg";
import { ArrowRight } from "lucide-react";

{/* <a */}
//           href={getAppUrl(IOI_APPS.find(a => a.id === 'hub')!)}
//           className="px-8 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 transition-colors w-full sm:w-auto"
//         >
//           Launch Hub
//         </a>

export const Hero = () => {
  return (
    <div className="relative">
    <div className="w-full flex justify-between items-center top-1/3 absolute">
      <img src={Container} alt="format line" className="" />
      <img src={FormatLine} alt="format line" className="" />
    </div>
      <div className="w-screen sm:max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        <div
          className="w-full aspect-[12/8] bg-black grid border-l border-t border-white/10"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
          }}
        >
          {/* Merged cell: columns 2–11, rows 2–5 (2-2 to 5-11) — hero content */}
          <div
            className="border-r border-b border-white/10 flex flex-col items-center justify-center p-6 md:p-8 bg-black font-sans"
            style={{ gridColumn: '2 / 12', gridRow: '2 / 6' }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center leading-[1.2]">
              <span className="block mb-3">The Infrastructure for</span>
              <span className="block">Autonomous Agents</span>
            </h1>
            <p className="leading-[1.3] text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-10 text-center">
              IOI Network is a decentralized physical infrastructure network <span className="bg-[#202020] px-1 py-0.5 rounded-md">(DePIN)</span> optimized for AI workloads.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-[16px] font-sans font-medium">
              <a
                href={getAppUrl(IOI_APPS.find(a => a.id === 'docs')!)}
                className="px-3 py-1.5 rounded-lg bg-white text-black transition-colors hover:bg-white/80 hover:scale-105 text-center flex items-center justify-center"
              >
                See Documentation
              </a>
              <a
                href={getAppUrl(IOI_APPS.find(a => a.id === 'hub')!)}
                className="px-3 py-1.5 rounded-lg bg-[#0075FF] text-white font-medium transition-colors inline-flex items-center justify-center gap-2 text-center hover:bg-[#0075FF]/80 hover:scale-105"
              >
                Launch Hub <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          {/* Grid cells (skip merged area) */}
          {Array.from({ length: 12 * 8 }, (_, i) => {
            const col = (i % 12) + 1;
            const row = Math.floor(i / 12) + 1;
            const inMerged = col >= 2 && col <= 11 && row >= 2 && row <= 5;
            if (inMerged) return null;
            return (
              <div
                key={i}
                className="border-r border-b border-white/10"
                style={{ gridColumn: col, gridRow: row }}
              />
            );
          })}
        </div>
        
        {/* <main className="relative z-10 max-w-6xl mx-auto px-6">
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
        </main> */}
      </div>
    </div>

  );
};
