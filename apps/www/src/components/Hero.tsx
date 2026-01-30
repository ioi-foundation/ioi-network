import { FadeIn, getAppUrl, IOI_APPS, Stagger } from "@ioi/ui";
import React from "react";
import Container from "../assets/Container.svg";
import FormatLine from "../assets/Container-R.svg";
import heroVideo from "../assets/Global.mkv?url";
import { ArrowRight } from "lucide-react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Hero = () => {
  return (
    <div className="relative">
      <div className="w-full justify-between items-center top-1/3 absolute hidden lg:flex">
        <img src={Container} alt="format line" className="" />
        <img src={FormatLine} alt="format line" className="" />
      </div>
      <div className="w-screen sm:max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative">
        <div
          className="w-full aspect-[12/8] bg-black grid border-l border-t border-white/10"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
          }}
        >
          {/* Merged cell: hero content — responsive padding, type, and buttons */}
          <div
            className="relative border-r border-b border-white/10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-black font-sans min-w-0"
            style={{ gridColumn: '2 / 12', gridRow: '2 / 6' }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 text-center leading-[1.2] z-10">
              <span className="block mb-2 sm:mb-3">The Infrastructure for</span>
              <span className="block">Autonomous Agents</span>
            </h1>
            <p className="leading-[1.3] text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-6 sm:mb-10 text-center px-1 z-10">
              IOI Network is a decentralized physical infrastructure network{" "}
              <span className="bg-[#202020] px-1 py-0.5 rounded-md">(DePIN)</span> optimized for AI workloads.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center text-sm sm:text-base font-sans font-medium w-full sm:w-auto z-10">
              <a
                href={getAppUrl(IOI_APPS.find(a => a.id === 'docs')!)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-white text-black transition-colors hover:bg-white/80 hover:scale-[1.02] active:scale-[0.98] text-center flex items-center justify-center"
              >
                See Documentation
              </a>
              <a
                href={getAppUrl(IOI_APPS.find(a => a.id === 'hub')!)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#0075FF] text-white font-medium transition-colors inline-flex items-center justify-center gap-2 text-center hover:bg-[#0075FF]/80 hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch Hub <ArrowRight className="w-4 h-4 shrink-0" />
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
                className="border-r border-b border-white/10 z-10"
                style={{ gridColumn: col, gridRow: row }}
              />
            );
          })}
          {/* Background video (muted, loop, autoplay for hero) */}
          
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
      <video
            src={heroVideo}
            className="absolute left-1/2 -translate-x-1/2 w-[85vw] max-w-[650px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[650px] -bottom-[100px] sm:-bottom-[160px] md:-bottom-[220px] lg:-bottom-[280px] xl:-bottom-[300px] pointer-events-none object-contain"
            muted
            loop
            autoPlay
            playsInline
            aria-hidden
          />
    </div>

  );
};
