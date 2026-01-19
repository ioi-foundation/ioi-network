import React, { useEffect, useState, useRef } from 'react';
import { Search, LayoutDashboard, Vote, ShieldCheck, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const CommandPalette = ({ isOpen, setIsOpen }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { id: 'nav-dash', label: 'Dashboard', hint: 'Network overview', icon: LayoutDashboard, action: () => navigate('/') },
    { id: 'nav-gov', label: 'Governance', hint: 'View proposals', icon: Vote, action: () => navigate('/governance') },
    { id: 'nav-uw', label: 'Underwriting', hint: 'Stake on agents', icon: ShieldCheck, action: () => navigate('/underwriting') },
    { id: 'nav-jud', label: 'Judiciary', hint: 'Slashing events', icon: Scale, action: () => navigate('/judiciary') },
  ];

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.hint.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape') setIsOpen(false);
      
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(i => (i + 1) % filtered.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length);
        }
        if (e.key === 'Enter' && filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          setIsOpen(false);
          setQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen, filtered, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center pt-[20vh]" 
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center px-4 h-12 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-500 mr-3" />
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm"
            placeholder="Search commands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        
        {/* Results */}
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-zinc-500">No results found</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { item.action(); setIsOpen(false); setQuery(''); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  idx === selectedIndex ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                }`}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  idx === selectedIndex ? 'bg-zinc-700' : 'bg-zinc-800'
                }`}>
                  <item.icon className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">{item.label}</div>
                  <div className="text-xs text-zinc-500">{item.hint}</div>
                </div>
                {idx === selectedIndex && (
                  <kbd className="text-[10px] text-zinc-500 bg-zinc-700 px-1.5 py-0.5 rounded">↵</kbd>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};