import React, { useState, useEffect, useRef } from 'react';
import { Menu, Command, LogOut, Copy, ChevronDown, Circle } from 'lucide-react'; 
import { useLocation, Link } from 'react-router-dom';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext'; 
import { CommandPalette } from './CommandPalette'; 

const ROUTE_NAMES: Record<string, string> = {
  '/': 'Dashboard',
  '/governance': 'Governance',
  '/underwriting': 'Underwriting',
  '/judiciary': 'Judiciary',
};

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { isConnected, connectWallet, disconnectWallet, user, balance } = useNetwork();
  const { addToast } = useToast();
  const [cmdOpen, setCmdOpen] = useState(false);
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
      <CommandPalette isOpen={cmdOpen} setIsOpen={setCmdOpen} />
      
      <header className="h-12 sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-between px-4">
        
        {/* Left: Menu + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-zinc-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>

          <nav className="flex items-center text-sm">
            <Link to="/" className="text-zinc-500 hover:text-white transition-colors">
              IOI
            </Link>
            <span className="mx-2 text-zinc-700">/</span>
            <span className="text-white font-medium">{currentPathName}</span>
          </nav>
        </div>

        {/* Center: Command trigger */}
        <button 
          onClick={() => setCmdOpen(true)}
          className="hidden md:flex items-center h-8 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-colors"
        >
          <Command className="w-3.5 h-3.5 mr-2" />
          <span className="mr-8">Search...</span>
          <kbd className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>

        {/* Right: Profile */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {isConnected && user ? (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 h-8 pl-3 pr-2 rounded-md border transition-colors ${
                  profileOpen 
                    ? 'bg-zinc-800 border-zinc-700' 
                    : 'border-transparent hover:bg-zinc-900'
                }`}
              >
                <span className="text-sm font-mono text-zinc-300">{balance.toLocaleString()} IOI</span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
                <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
                  {/* Address */}
                  <div className="p-3 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Address</span>
                      <button onClick={copyDid} className="text-zinc-500 hover:text-white">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-mono text-white mt-1">{user.economicDid}</div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 divide-x divide-zinc-800 border-b border-zinc-800">
                    <div className="p-3 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase">Reputation</div>
                      <div className="text-sm font-medium text-white mt-0.5">{user.reputation}</div>
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase">Voting Power</div>
                      <div className="text-sm font-medium text-white mt-0.5">{(balance / 1000).toFixed(1)}k</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-1">
                    <button 
                      onClick={() => { disconnectWallet(); setProfileOpen(false); }}
                      className="w-full flex items-center px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="h-8 px-3 rounded-md bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Connect
            </button>
          )}
        </div>
      </header>
    </>
  );
};