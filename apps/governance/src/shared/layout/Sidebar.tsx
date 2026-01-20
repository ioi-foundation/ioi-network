import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Vote, 
  ShieldCheck, 
  Scale, 
  ChevronLeft,
  ChevronRight,
  Circle,
  Grid
} from 'lucide-react';
// Refactored import: Use the shared UI package instead of local file
import { MegaMenu } from '@ioi/ui';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Governance', icon: Vote, path: '/governance' },
  { name: 'Underwriting', icon: ShieldCheck, path: '/underwriting' },
  { name: 'Judiciary', icon: Scale, path: '/judiciary' },
];

export const Sidebar = ({ 
  mobileOpen, 
  setMobileOpen,
  collapsed,
  setCollapsed
}: { 
  mobileOpen: boolean; 
  setMobileOpen: (o: boolean) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}) => {
  const location = useLocation();
  const [blockHeight, setBlockHeight] = useState(12940221);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setBlockHeight(h => h + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MegaMenu 
        isOpen={megaMenuOpen} 
        onClose={() => setMegaMenuOpen(false)} 
        currentApp="governance" 
      />

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 z-50 bg-zinc-950 border-r border-zinc-800
        transform transition-all duration-200 ease-out
        top-9 bottom-0 /* Pushed down by NetworkHeader */
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-16' : 'w-56'} 
        flex flex-col
      `}>
        
        {/* Collapse toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white rounded-full transition-colors z-50"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* App Context Header (Replaces SVG Logo) */}
        <button 
          onClick={() => setMegaMenuOpen(true)}
          className={`h-14 flex items-center border-b border-zinc-800 hover:bg-zinc-900 transition-colors group relative ${collapsed ? 'justify-center px-0' : 'px-4 justify-between'}`}
          title="Switch App"
        >
          {collapsed ? (
            <Grid className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400" />
          ) : (
            <>
              <span className="font-bold text-white tracking-tight">Governance</span>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 group-hover:border-zinc-700 transition-colors">v2.4</span>
            </>
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center h-9 rounded-md transition-colors relative group
                    ${collapsed ? 'justify-center px-0' : 'px-3'}
                    ${isActive 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}
                  `}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  
                  {!collapsed && (
                    <span className="ml-3 text-[13px] font-medium">{item.name}</span>
                  )}

                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 border border-zinc-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer status */}
        <div className={`border-t border-zinc-800 ${collapsed ? 'p-2' : 'p-3'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
            <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-zinc-500">Mainnet-Beta</div>
                <div className="text-[11px] font-mono text-zinc-400">#{blockHeight.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};