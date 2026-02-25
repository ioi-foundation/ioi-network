import { FadeIn, getAppUrl, IOI_APPS, Stagger } from "@ioi/ui";
import React from "react";
import { ArrowRight } from "lucide-react";
import { HyperGlobe } from "./HyperGlobe";

export const Hero = () => {
  const GRID_COLUMNS = 12;
  const GRID_ROWS = 5;

  return (
    <div className="relative">
      <div className="w-screen sm:max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative">
        <div
          className="w-full bg-black grid border-l border-t border-white/10"
          style={{
            aspectRatio: `${GRID_COLUMNS} / ${GRID_ROWS}`,
            gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          }}
        >
          {/* Merged cell: hero content — responsive padding, type, and buttons */}
          <div
            className="relative border-r border-b border-white/10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-black font-sans min-w-0"
            style={{ gridColumn: "2 / 12", gridRow: "2 / 5" }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 text-center leading-[1.2] z-30">
              <span className="block mb-2 sm:mb-3">The Infrastructure for</span>
              <span className="block">Autonomous Agents</span>
            </h1>
            <p className="leading-[1.3] text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-6 sm:mb-10 text-center px-1 z-30">
              IOI Network is a decentralized physical infrastructure network{" "}
              <span className="bg-[#202020] px-1 py-0.5 rounded-md">(DePIN)</span> optimized for AI workloads.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center text-sm sm:text-base font-sans font-medium w-full sm:w-auto z-30">
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
          {/* Grid overlay cells */}
          {Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, i) => {
            const col = (i % GRID_COLUMNS) + 1;
            const row = Math.floor(i / GRID_COLUMNS) + 1;
            const inMergedCore = col >= 2 && col <= 11 && row >= 2 && row <= 4;
            if (inMergedCore) return null;

            const isBottomInterior = row === 5 && col >= 2 && col <= 11;
            return (
              <div
                key={i}
                className={`border-r border-b border-white/10 z-10 ${isBottomInterior ? "border-t" : ""}`}
                style={{ gridColumn: col, gridRow: row }}
              />
            );
          })}

        </div>
      </div>
      <HyperGlobe className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] z-20" />
    </div>

  );
};
