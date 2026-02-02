import { getAppUrl, IOI_APPS } from "@ioi/ui";
import { ArrowRight } from "lucide-react";
import React from "react";
export const Explore = () => {
  return (
    <div className="border-l border-r border-b border-white/10 py-10 px-4 sm:px-6 md:px-8 lg:py-16 lg:px-12 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-0">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 sm:gap-4 font-sans font-medium max-w-xl w-full">
        <p className="text-2xl sm:text-3xl lg:text-4xl text-white leading-[1.2]">
          Core modules to build, operate, and govern on IOI.
        </p>
        <p className="text-base sm:text-lg lg:text-xl text-white/60 leading-[1.3]">
          Unified suite Hub, Governance, Docs, Explorer, and Agent Studio connected by one identity, one permissions model, and one audit trail.
        </p>
      </div>
      <div className="flex flex-col items-center lg:items-start font-medium font-sans max-w-md w-full gap-4 sm:gap-6">
        <p className="text-base sm:text-lg lg:text-xl text-white/60 leading-[1.3] text-center lg:text-left">
          Start with the Hub to provision wallets and roles, then move into proposals, developer references, real-time ledger visibility, and agent deployment.
        </p>
        <a href={getAppUrl(IOI_APPS.find(a => a.id === 'hub')!)} className="flex items-center bg-white text-black px-2.5 py-1.5 rounded-full hover:bg-white/80 transition-all duration-300 hover:scale-105 shrink-0">
          Explore IOI Hub
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};