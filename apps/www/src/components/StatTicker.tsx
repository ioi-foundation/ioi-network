import { SkeletonCard } from "@ioi/ui";
import { Cpu, Globe, Layers, Network } from "lucide-react";
import { useEffect, useState } from "react";
import chart1 from "../assets/chart1.svg";
import chart2 from "../assets/chart2.svg";
import chart3 from "../assets/chart3.png";
import chart4 from "../assets/chart4.svg";

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

  const stats = [
    { label: 'Block Height', value: `#${blockHeight.toLocaleString()}`, icon: Layers, addition: "↑0.4s", image: chart1 },
    { label: 'Network TPS', value: tps.toLocaleString(), icon: Network, addition: "Peak:↑1612", image: chart2 },
    { label: 'Active Agents', value: '14,203', icon: Cpu, addition: "+1,024 (10m)", image: chart3 },
    { label: 'Global Nodes', value: '842', icon: Globe, addition: "Uptime:99.99%", image: chart4 },
  ];

  return (
    <div className="w-full max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-l border-r border-b border-white/10 p-4 sm:p-6 md:p-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 pr-2 sm:py-4 sm:pl-4 sm:pr-4"
          >
            <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
              <div className="flex items-center gap-1.5 text-white/60">
                <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                  {stat.label}
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
                {stat.addition}
              </div>
            </div>
            <img
              src={stat.image}
              alt={stat.label}
              className={`absolute right-0 object-cover ${i === 0 ? '' : 'h-full top-0 bottom-0'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};