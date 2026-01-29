import React from 'react';
import { IOI_APPS, getAppUrl, NetworkAppId } from '../config';
import { ArrowRight, Cpu } from 'lucide-react';
// IOI Logo (from apps/governance/assets; grayscale + color layers)
const IOILogo = ({ className = "w-[18px] h-[18px]" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 220" className={className} fill="none" role="img" aria-label="IOI logo">
    <defs>
      {/* Grey gradients (grayscale layer) */}
      <linearGradient id="grey-gradient-0" x1="295.29922" y1="544.37323" x2="485.37869" y2="544.37323" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#71717a" /><stop offset="1" stopColor="#52525b" /></linearGradient>
      <linearGradient id="grey-gradient-1" x1="302.60983" y1="421.96817" x2="697.38995" y2="421.96817" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#d4d4d8" /><stop offset="1" stopColor="#a1a1aa" /></linearGradient>
      <linearGradient id="grey-gradient-2" x1="797.68262" y1="740.59412" x2="797.68262" y2="425.08493" gradientUnits="userSpaceOnUse"><stop offset=".201" stopColor="#52525b" /><stop offset="1" stopColor="#3f3f46" /></linearGradient>
      <linearGradient id="grey-gradient-3" x1="609.66095" y1="654.11517" x2="609.66095" y2="434.63083" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#a1a1aa" /><stop offset="1" stopColor="#71717a" /></linearGradient>
      <linearGradient id="grey-gradient-4" x1="223.74698" y1="846.12201" x2="392.67313" y2="694.02026" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#71717a" /><stop offset="1" stopColor="#52525b" /></linearGradient>
      <linearGradient id="grey-gradient-5" x1="518.72632" y1="314.34213" x2="622.43689" y2="252.02652" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#71717a" /><stop offset=".29" stopColor="#65656c" /><stop offset=".55" stopColor="#52525b" /><stop offset=".80" stopColor="#3f3f46" /><stop offset="1" stopColor="#27272a" /></linearGradient>
      <linearGradient id="grey-gradient-6" x1="202.31723" y1="740.59436" x2="202.31723" y2="425.0856" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#a1a1aa" /><stop offset=".53" stopColor="#d4d4d8" /><stop offset="1" stopColor="#e4e4e7" /></linearGradient>
      <linearGradient id="grey-gradient-7" x1="688.67969" y1="780.74152" x2="688.67969" y2="675.21942" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#52525b" /><stop offset="1" stopColor="#3f3f46" /></linearGradient>
      <linearGradient id="grey-gradient-8" x1="389.87204" y1="414.0657" x2="389.87204" y2="104.77927" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#e4e4e7" /><stop offset="1" stopColor="#a1a1aa" /></linearGradient>
      <linearGradient id="grey-gradient-9" x1="401.3049" y1="780.74152" x2="401.3049" y2="552.8147" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#71717a" /><stop offset=".32" stopColor="#65656c" /><stop offset=".94" stopColor="#52525b" /><stop offset="1" stopColor="#3f3f46" /></linearGradient>
      <linearGradient id="grey-gradient-10" x1="598.69513" y1="780.74139" x2="598.69513" y2="552.8147" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#a1a1aa" /><stop offset=".16" stopColor="#a1a1aa" /><stop offset=".41" stopColor="#71717a" /><stop offset=".71" stopColor="#52525b" /><stop offset="1" stopColor="#3f3f46" /></linearGradient>
      {/* Nav/color gradients */}
      <linearGradient id="nav-gradient-0" x1="295.29922" y1="544.37323" x2="485.37869" y2="544.37323" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#3650c0" /><stop offset="1" stopColor="#346acf" /></linearGradient>
      <linearGradient id="nav-gradient-1" x1="302.60983" y1="421.96817" x2="697.38995" y2="421.96817" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f7f8f7" /><stop offset="1" stopColor="#b0c6f4" /></linearGradient>
      <linearGradient id="nav-gradient-2" x1="797.68262" y1="740.59412" x2="797.68262" y2="425.08493" gradientUnits="userSpaceOnUse"><stop offset=".201" stopColor="#3b5eda" /><stop offset="1" stopColor="#2740a8" /></linearGradient>
      <linearGradient id="nav-gradient-3" x1="609.66095" y1="654.11517" x2="609.66095" y2="434.63083" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#c8dcfd" /><stop offset="1" stopColor="#93bef8" /></linearGradient>
      <linearGradient id="nav-gradient-4" x1="223.74698" y1="846.12201" x2="392.67313" y2="694.02026" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#83a0e0" /><stop offset="1" stopColor="#5b86de" /></linearGradient>
      <linearGradient id="nav-gradient-5" x1="518.72632" y1="314.34213" x2="622.43689" y2="252.02652" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#759ce8" /><stop offset=".29" stopColor="#7198e5" /><stop offset=".55" stopColor="#688dde" /><stop offset=".80" stopColor="#587bd2" /><stop offset="1" stopColor="#4666c4" /></linearGradient>
      <linearGradient id="nav-gradient-6" x1="202.31723" y1="740.59436" x2="202.31723" y2="425.0856" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#d3d3df" /><stop offset=".53" stopColor="#e8e9ed" /><stop offset="1" stopColor="#f7f8f7" /></linearGradient>
      <linearGradient id="nav-gradient-7" x1="688.67969" y1="780.74152" x2="688.67969" y2="675.21942" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5a8cec" /><stop offset="1" stopColor="#3b67d3" /></linearGradient>
      <linearGradient id="nav-gradient-8" x1="389.87204" y1="414.0657" x2="389.87204" y2="104.77927" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f7f8f7" /><stop offset="1" stopColor="#b2c8f4" /></linearGradient>
      <linearGradient id="nav-gradient-9" x1="401.3049" y1="780.74152" x2="401.3049" y2="552.8147" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#75abf0" /><stop offset=".32" stopColor="#699aeb" /><stop offset=".94" stopColor="#4d6fe0" /><stop offset="1" stopColor="#4a6bdf" /></linearGradient>
      <linearGradient id="nav-gradient-10" x1="598.69513" y1="780.74139" x2="598.69513" y2="552.8147" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#bbd8f2" /><stop offset=".16" stopColor="#b3d3f1" /><stop offset=".41" stopColor="#9ec6ef" /><stop offset=".71" stopColor="#7cb0ed" /><stop offset="1" stopColor="#5698ea" /></linearGradient>
    </defs>
    <g transform="matrix(0.30954877,0,0,0.30954877,-38.370644,-32.434294)">
      <g className="logo-layer-grayscale" style={{ opacity: 0 }}>
        <polygon points="295.29922,434.6309 295.29922,654.11552 485.37869,544.37308" fill="url(#grey-gradient-0)" />
        <polygon points="499.99985,308.00492 302.60983,421.96842 500.00003,535.93143 697.38998,421.96842" fill="url(#grey-gradient-1)" />
        <polygon points="876.0433,695.9025 719.32187,425.08494 719.32187,662.5568 854.48666,740.59409" fill="url(#grey-gradient-2)" />
        <polygon points="514.62137,544.37308 704.70053,654.11515 704.70053,434.63084" fill="url(#grey-gradient-3)" />
        <polygon points="164.87808,780.74149 470.75729,780.74149 287.98837,675.21964 151.88309,753.80002" fill="url(#grey-gradient-4)" />
        <polygon points="533.96182,104.77927 507.31009,104.77927 507.31009,295.34232 712.94528,414.06602" fill="url(#grey-gradient-5)" />
        <polygon points="123.9567,695.9025 145.51346,740.59434 280.67776,662.55717 280.67776,425.08561" fill="url(#grey-gradient-6)" />
        <polygon points="835.12192,780.74149 848.11703,753.79978 712.01157,675.2194 529.2424,780.74149" fill="url(#grey-gradient-7)" />
        <polygon points="466.03824,104.77927 287.05496,414.06571 492.68912,295.34263 492.68912,104.77927" fill="url(#grey-gradient-8)" />
        <polygon points="500.00003,780.74137 500.00003,552.81467 302.60977,666.77799 499.99985,780.74149" fill="url(#grey-gradient-9)" />
        <polygon points="500.00003,552.81467 500.00003,780.74137 697.39023,666.77781" fill="url(#grey-gradient-10)" />
      </g>
      <g className="logo-layer-color">
        <polygon points="295.29922,434.6309 295.29922,654.11552 485.37869,544.37308" fill="url(#nav-gradient-0)" />
        <polygon points="499.99985,308.00492 302.60983,421.96842 500.00003,535.93143 697.38998,421.96842" fill="url(#nav-gradient-1)" />
        <polygon points="876.0433,695.9025 719.32187,425.08494 719.32187,662.5568 854.48666,740.59409" fill="url(#nav-gradient-2)" />
        <polygon points="514.62137,544.37308 704.70053,654.11515 704.70053,434.63084" fill="url(#nav-gradient-3)" />
        <polygon points="164.87808,780.74149 470.75729,780.74149 287.98837,675.21964 151.88309,753.80002" fill="url(#nav-gradient-4)" />
        <polygon points="533.96182,104.77927 507.31009,104.77927 507.31009,295.34232 712.94528,414.06602" fill="url(#nav-gradient-5)" />
        <polygon points="123.9567,695.9025 145.51346,740.59434 280.67776,662.55717 280.67776,425.08561" fill="url(#nav-gradient-6)" />
        <polygon points="835.12192,780.74149 848.11703,753.79978 712.01157,675.2194 529.2424,780.74149" fill="url(#nav-gradient-7)" />
        <polygon points="466.03824,104.77927 287.05496,414.06571 492.68912,295.34263 492.68912,104.77927" fill="url(#nav-gradient-8)" />
        <polygon points="500.00003,780.74137 500.00003,552.81467 302.60977,666.77799 499.99985,780.74149" fill="url(#nav-gradient-9)" />
        <polygon points="500.00003,552.81467 500.00003,780.74137 697.39023,666.77781" fill="url(#nav-gradient-10)" />
      </g>
    </g>
  </svg>
);

export interface NetworkHeaderProps {
  currentAppId: NetworkAppId;
  className?: string;
}
// ArrowRight, Globe, Cpu, Zap, Layers
export const NetworkHeader = ({ currentAppId, className = '' }: NetworkHeaderProps) => {
  return (
    <div className="w-screen bg-black">
      {/* header banner */}
      <div className="w-full max-w-full sm:max-w-full md:max-w-6xl lg:max-w-7xl xl:max-w-[1536px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <nav className='flex justify-between items-center my-2'>
          <div className='flex items-center gap-2.5'>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-white" />
              <span className="text-xs font-medium text-white leading-3 tracking-tighter font-sans">
                Mainnet:
              </span>
            </div>
            <div className="flex items-center justify-center bg-[#0D2236] text-[#0075FF] text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] font-sans">
              Operational
            </div>
          </div>
          <p className='font-sans font-medium text-xs text-white/80'>Mainnet Beta v2.4.0 is Live •  Kernel updates, faster finality, and improved agent underwriting.</p>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white/60 transition-all hover:scale-105">
            <p className='text-xs font-sans text-white/80 font-medium'>Release notes</p>
            <ArrowRight className="text-white/80 w-3.5 h-3.5" />
          </div>
        </nav>
      </div>
      {/* divide line */}
      <div className="w-full h-[1px] bg-white/10" />
      {/* header navigation */}
      <div className="w-full max-w-full sm:max-w-full md:max-w-6xl lg:max-w-7xl xl:max-w-[1536px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <nav className="my-3.5 flex justify-between items-center">
          {/* Left: Network Logo & App Switcher */}
          <div className="flex items-center gap-8">
            {/* Company Logo */}
            <a href={getAppUrl(IOI_APPS[0])} className="flex items-center gap-1.5 group">
              <IOILogo />
              <span className="text-sm font-bold text-white tracking-tight font-sans">
                IOI
              </span>
            </a>

            {/* App Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              {IOI_APPS.map((app) => {
                // Skip the "Gateway" (www) in the quick switcher, show specific apps
                if (app.id === 'www') return null;

                const isActive = app.id === currentAppId;
                const Icon = app.icon;

                return (
                  <a
                    key={app.id}
                    href={getAppUrl(app)}
                    className={`
                  flex items-center gap-1.5 font-medium font-sans transition-all text-sm hover:text-white
                  ${isActive
                        ? 'text-white shadow-sm'
                        : 'text-white/60'}
                `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {app.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: Global Utilities */}
          <button className='flex items-center gap-1.5 font-medium font-sans transition-all text-sm hover:text-white bg-[#0075FF] hover:bg-[#0075FF]/80 hover:scale-105 rounded-lg py-1 px-1.5'>
            Launch Hub
            <ArrowRight className='w-3.5 h-3.5' />
          </button>
        </nav>
      </div>
      {/* divide line */}
      <div className="w-full h-[1px] bg-white/10" />
    </div>
  );
};