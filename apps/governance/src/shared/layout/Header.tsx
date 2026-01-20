import React, { useState, useEffect, useRef } from 'react';
import { Menu, LayoutGrid, LogOut, Copy, ChevronDown, ExternalLink } from 'lucide-react'; 
import { useLocation, Link } from 'react-router-dom';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext'; 
import { MegaMenu } from '@ioi/ui'; // Refactored import

const ROUTE_NAMES: Record<string, string> = {
  '/': 'Dashboard',
  '/governance': 'Governance',
  '/underwriting': 'Underwriting',
  '/judiciary': 'Judiciary',
};

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { isConnected, connectWallet, disconnectWallet, user, balance } = useNetwork();
  const { addToast } = useToast();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setMenuOpen(prev => !prev);
      }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyDid = () => {
    if (user?.economicDid) {
      navigator.clipboard.writeText(user.economicDid);
      addToast('info', 'Copied', 'Address copied to clipboard');
      setProfileOpen(false);
    }
  };

  const currentPathName = ROUTE_NAMES[location.pathname] || 'Unknown';
  
  return (
    <>
      <MegaMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        currentApp="governance" 
      />
      
      <header className="h-14 sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-between px-4">
        
        {/* Left: Mobile Menu + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-zinc-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>

          <nav className="flex items-center text-sm">
            <Link to="/" className="text-zinc-500 hover:text-white transition-colors font-semibold tracking-tight">
              IOI
            </Link>
            <span className="mx-2 text-zinc-700">/</span>
            <span className="text-white font-medium tracking-wide">{currentPathName}</span>
          </nav>
        </div>

        {/* Center: Network Switcher */}
        <div className="hidden md:block">
            <button 
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:border-zinc-700 hover:text-white hover:bg-zinc-900 transition-all"
            >
              <LayoutGrid className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors" />
              <span>Network Services</span>
              <kbd className="hidden lg:inline-block ml-2 text-[9px] bg-zinc-800 px-1 py-0.5 rounded text-zinc-500 group-hover:text-zinc-400">⌘K</kbd>
            </button>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {isConnected && user ? (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-3 h-9 pl-3 pr-2 rounded-full border transition-all duration-200 ${
                  profileOpen 
                    ? 'bg-zinc-800 border-zinc-700' 
                    : 'border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-zinc-500 leading-none mb-0.5">Balance</div>
                    <div className="text-xs font-mono text-zinc-200 leading-none">{balance.toLocaleString()} IOI</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 ring-2 ring-zinc-950" />
                <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-zinc-800 bg-zinc-950/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-500">Connected DID</span>
                      <button onClick={copyDid} className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-800 rounded">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 break-all bg-cyan-950/20 border border-cyan-900/30 p-2 rounded">
                        {user.economicDid}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-zinc-800 border-b border-zinc-800">
                    <div className="p-3 text-center hover:bg-zinc-800/50 transition-colors">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Reputation</div>
                      <div className="text-lg font-medium text-white mt-1">{user.reputation}</div>
                    </div>
                    <div className="p-3 text-center hover:bg-zinc-800/50 transition-colors">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Voting Power</div>
                      <div className="text-lg font-medium text-white mt-1">{(balance / 1000).toFixed(1)}k</div>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <a href="#" className="flex items-center justify-between px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors group">
                        <span>View on Explorer</span>
                        <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                    </a>
                    <button 
                      onClick={() => { disconnectWallet(); setProfileOpen(false); }}
                      className="w-full flex items-center px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                    >
                      <LogOut className="w-3 h-3 mr-2" />
                      Disconnect Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="h-9 px-4 rounded-full bg-white text-zinc-950 text-xs font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)]"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>
    </>
  );
};