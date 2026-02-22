import { Cpu, Globe, Layers, Network } from "lucide-react";
import { useEffect, useState } from "react";
import InfoGraphic1 from "../assets/Infographic1.json";
import InfoGraphic2 from "../assets/Infographic2.json";
import InfoGraphic3 from "../assets/Infographic3.json";
import InfoGraphic4 from "../assets/Infographic4.json";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const StatTicker = () => {
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

  // const stats = [
  //   { label: 'Block Height', value: `#${blockHeight.toLocaleString()}`, icon: Layers, addition: "↑0.4s", lottieAnimation: InfoGraphic1 },
  //   { label: 'Network TPS', value: tps.toLocaleString(), icon: Network, addition: "Peak:↑1612", lottieAnimation: InfoGraphic2 },
  //   { label: 'Active Agents', value: '14,203', icon: Cpu, addition: "+1,024 (10m)", lottieAnimation: InfoGraphic3 },
  //   { label: 'Global Nodes', value: '842', icon: Globe, addition: "Uptime:99.99%", lottieAnimation: InfoGraphic4 },
  // ];

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
              #12940221
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              ↑0.4s
            </div>
          </div>
          <div
            className={`absolute -right-14 top-0 bottom-0`}
          >
            <DotLottieReact
              data={JSON.stringify(InfoGraphic1)}
              loop
              autoplay
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
              1240
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              Peak:↑1612
            </div>
          </div>
          <div
            className={`absolute -right-[70px] top-0 bottom-0`}
          >
            <DotLottieReact
              data={JSON.stringify(InfoGraphic2)}
              loop
              autoplay
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
              14,203
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              +1,024 (10m)
            </div>
          </div>
          <div
            className={`absolute -right-16 top-0 bottom-0`}
          >
            <DotLottieReact
              data={JSON.stringify(InfoGraphic3)}
              loop
              autoplay
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
              842
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              Uptime:99.99%
            </div>
          </div>
          <div
            className={`absolute -right-[74px] top-0 bottom-0`}
          >
            <DotLottieReact
              data={JSON.stringify(InfoGraphic4)}
              loop
              autoplay
            />
          </div>
        </div>
    </div>
  );
};