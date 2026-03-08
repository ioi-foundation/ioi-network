import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Circle, Grid, LayoutDashboard, Scale, ShieldCheck, Vote } from 'lucide-react';
import { ConsoleSidebar, ConsoleSidebarGroup, MegaMenu } from '@ioi/ui';

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'governance', name: 'Governance', icon: Vote, path: '/governance' },
  { id: 'underwriting', name: 'Underwriting', icon: ShieldCheck, path: '/underwriting' },
  { id: 'judiciary', name: 'Judiciary', icon: Scale, path: '/judiciary' },
];

export const Sidebar = ({ 
  mobileOpen, 
  setMobileOpen
}: { 
  mobileOpen: boolean; 
  setMobileOpen: (o: boolean) => void;
}) => {
  const location = useLocation();
  const [blockHeight, setBlockHeight] = useState(12940221);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const sidebarGroups = useMemo<ConsoleSidebarGroup[]>(() => {
    const items = navItems.map((item) => ({
      id: item.id,
      label: item.name,
      icon: <item.icon className="h-4 w-4" />,
      href: `#${item.path}`,
      active: location.pathname === item.path,
    }));

    return [
      { id: 'overview', label: 'Overview', items: items.slice(0, 1) },
      { id: 'domains', label: 'Governance Domains', items: items.slice(1) },
    ];
  }, [location.pathname]);

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

      <ConsoleSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        title="Governance"
        version="v2.4"
        headerIcon={<Grid className="h-5 w-5 text-zinc-500" />}
        onHeaderClick={() => setMegaMenuOpen(true)}
        groups={sidebarGroups}
        footer={
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Circle className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">Mainnet</div>
                <div className="text-[11px] font-mono text-zinc-400">#{blockHeight.toLocaleString()}</div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};
