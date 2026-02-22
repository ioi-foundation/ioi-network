import { Cpu, Globe, Layers, Network } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import InfoGraphic1 from "../assets/Infographic1.json";
import InfoGraphic2 from "../assets/Infographic2.json";
import InfoGraphic3 from "../assets/Infographic3.json";
import InfoGraphic4 from "../assets/Infographic4.json";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";

// Block Height: max expected blocks per update interval
const MAX_BLOCK_DELTA = 5;
// Network TPS
const MAX_TPS = 2000;
// Active Agents
const MAX_AGENTS = 20000;
const MAX_AGENT_DELTA = 2000;
// Global Nodes
const MAX_NODES = 5000;

export const StatTicker = () => {
  const [blockHeight, setBlockHeight] = useState(12940221);
  const [blockUpdateTime, setBlockUpdateTime] = useState(0.4);
  const [tps, setTps] = useState(1240);
  const [peakTps, setPeakTps] = useState(1612);
  const [activeAgents, setActiveAgents] = useState(14203);
  const [agentsDelta, setAgentsDelta] = useState(1024);
  const [globalNodes, setGlobalNodes] = useState(842);
  const [uptime, setUptime] = useState(99.99);

  const prevBlockHeight = useRef(blockHeight);

  const dotLottie1 = useRef<DotLottie | null>(null);
  const dotLottie2 = useRef<DotLottie | null>(null);
  const dotLottie3 = useRef<DotLottie | null>(null);
  const dotLottie4 = useRef<DotLottie | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(h => h + 1);
      setBlockUpdateTime(Math.random() * 1.5 + 0.1);
      setTps(prev => {
        const next = prev + Math.floor(Math.random() * 40) - 20;
        return Math.max(0, next);
      });
      setPeakTps(prev => {
        const current = tps + Math.floor(Math.random() * 40) - 20;
        return Math.max(prev, current);
      });
      setActiveAgents(prev => prev + Math.floor(Math.random() * 50));
      setAgentsDelta(prev => Math.max(0, prev + Math.floor(Math.random() * 100) - 30));
      setGlobalNodes(prev => Math.max(100, prev + Math.floor(Math.random() * 10) - 5));
      setUptime(prev => Math.min(100, Math.max(95, prev + (Math.random() * 0.02 - 0.01))));
    }, 2000);
    return () => clearInterval(interval);
  }, [tps]);

  // Block Height Lottie: 4 bars per concept doc §2–§3
  // Bar 1 (height growth) | Bar 2 (freshness) | Bar 3 (height scale) | Bar 4 (pulse)
  useEffect(() => {
    const lottie = dotLottie1.current;
    if (!lottie) return;

    const delta = blockHeight - prevBlockHeight.current;
    prevBlockHeight.current = blockHeight;

    const heightGrowth = Math.min(1, delta / MAX_BLOCK_DELTA);
    const freshness = Math.max(0, 1 - blockUpdateTime / 2);
    const heightScale = (blockHeight % 10000) / 10000;
    const pulse = Math.max(0, 1 - blockUpdateTime) * (delta > 0 ? 1 : 0.5);

    const activity =
      heightGrowth * 0.3 + freshness * 0.3 + heightScale * 0.1 + pulse * 0.3;
    lottie.setSpeed(0.3 + activity * 1.7);
  }, [blockHeight, blockUpdateTime]);

  // Network TPS Lottie: 8 bars per concept doc §2–§3
  // Bar 1 (load) | Bar 2 (peak ref) | Bar 3 (utilization) | Bar 4 (headroom) | Bars 5–8 (digits)
  useEffect(() => {
    const lottie = dotLottie2.current;
    if (!lottie) return;

    const currentLoad = Math.min(1, tps / MAX_TPS);
    const peakRef = Math.min(1, peakTps / MAX_TPS);
    const utilization = peakTps > 0 ? Math.min(1, tps / peakTps) : 0;
    const headroom = 1 - utilization;

    const activity =
      currentLoad * 0.35 + peakRef * 0.15 + utilization * 0.3 + headroom * 0.2;
    lottie.setSpeed(0.3 + activity * 1.7);
  }, [tps, peakTps]);

  // Active Agents Lottie: arcs per concept doc §2–§3
  // Arc 1 (total scale) | Arc 2 (growth) | Arc 5 (delta mag) | Arc 6 (activity blend)
  useEffect(() => {
    const lottie = dotLottie3.current;
    if (!lottie) return;

    const totalScale = Math.min(1, activeAgents / MAX_AGENTS);
    const growth = Math.min(1, agentsDelta / MAX_AGENT_DELTA);
    const activityBlend = (totalScale + growth) / 2;

    const activity = totalScale * 0.25 + growth * 0.4 + activityBlend * 0.35;
    lottie.setSpeed(0.3 + activity * 1.7);
  }, [activeAgents, agentsDelta]);

  // Global Nodes Lottie: curves per concept doc §2–§3
  // Curve 1 (node scale) | Curve 2 (health) | Curve 5 (stability) | Curve 6 (blend)
  useEffect(() => {
    const lottie = dotLottie4.current;
    if (!lottie) return;

    const nodeScale = Math.min(1, globalNodes / MAX_NODES);
    const health = uptime / 100;
    const stability = health;
    const blend = nodeScale * 0.5 + health * 0.5;

    const activity =
      nodeScale * 0.25 + health * 0.3 + stability * 0.2 + blend * 0.25;
    lottie.setSpeed(0.3 + activity * 1.7);
  }, [globalNodes, uptime]);

  const fmt = (n: number) => n.toLocaleString();

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-l border-r border-b border-white/10 p-4 sm:p-6 md:p-8">
        <div
          className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 pr-2 sm:py-4 sm:pl-4 sm:pr-4"
        >
          <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
            <div className="flex items-center gap-1.5 text-white/60">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                Block Height
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
              #{fmt(blockHeight)}
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              ↑{blockUpdateTime.toFixed(1)}s
            </div>
          </div>
          <div
            className={`absolute -right-14 top-0 bottom-0`}
          >
            <DotLottieReact
              data={JSON.stringify(InfoGraphic1)}
              loop
              autoplay
              dotLottieRefCallback={(instance) => { dotLottie1.current = instance; }}
            />
          </div>
        </div>
        <div
          className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 pr-2 sm:py-4 sm:pl-4 sm:pr-4"
        >
          <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
            <div className="flex items-center gap-1.5 text-white/60">
              <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                Network TPS
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
              {fmt(tps)}
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              Peak:↑{fmt(peakTps)}
            </div>
          </div>
          <div
            className={`absolute -right-[70px] top-0 bottom-0`}
          >
            <DotLottieReact
              data={JSON.stringify(InfoGraphic2)}
              loop
              autoplay
              dotLottieRefCallback={(instance) => { dotLottie2.current = instance; }}
            />
          </div>
        </div>
        <div
          className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 pr-2 sm:py-4 sm:pl-4 sm:pr-4"
        >
          <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
            <div className="flex items-center gap-1.5 text-white/60">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                Active Agents
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
              {fmt(activeAgents)}
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              +{fmt(agentsDelta)} (10m)
            </div>
          </div>
          <div
            className={`absolute -right-16 top-0 bottom-0`}
          >
            <DotLottieReact
              data={JSON.stringify(InfoGraphic3)}
              loop
              autoplay
              dotLottieRefCallback={(instance) => { dotLottie3.current = instance; }}
            />
          </div>
        </div>
        <div
          className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 pr-2 sm:py-4 sm:pl-4 sm:pr-4"
        >
          <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
            <div className="flex items-center gap-1.5 text-white/60">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                Global Nodes
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
              {fmt(globalNodes)}
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              Uptime:{uptime.toFixed(2)}%
            </div>
          </div>
          <div
            className={`absolute -right-[74px] top-0 bottom-0`}
          >
            <DotLottieReact
              data={JSON.stringify(InfoGraphic4)}
              loop
              autoplay
              dotLottieRefCallback={(instance) => { dotLottie4.current = instance; }}
            />
          </div>
        </div>
    </div>
  );
};