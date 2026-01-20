import React, { useState } from 'react';
import { ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { DocItem, SidebarSection } from '../../core/types';
import { SyncResult } from '../../core/utils';

interface SidebarProps {
  section: SidebarSection;
  activeDocId: string;
  onSelect: (id: string) => void;
  syncStatuses: Record<string, SyncResult>; 
}

export const DocsSidebar = ({ section, activeDocId, onSelect, syncStatuses }: SidebarProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderItems = (items: DocItem[], depth = 0) => (
    <div className="space-y-0.5">
      {items.map(item => {
        const isActive = item.id === activeDocId;
        const hasChildren = item.items && item.items.length > 0;
        const status = syncStatuses[item.id]?.status;

        if (item.type === 'category') {
          return (
            <div key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors"
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
              >
                <div className="flex items-center gap-2">
                  {expanded.has(item.id) ? <FolderOpen className="w-3 h-3" /> : <Folder className="w-3 h-3" />}
                  {item.label}
                </div>
                {hasChildren && (
                  <ChevronDown className={`w-3 h-3 transition-transform ${expanded.has(item.id) ? 'rotate-0' : '-rotate-90'}`} />
                )}
              </button>
              {expanded.has(item.id) && item.items && (
                <div className="mt-1 mb-2 relative border-l border-zinc-800 ml-4">
                  {renderItems(item.items, depth + 1)}
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`
              w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-all relative group
              ${isActive 
                ? 'bg-zinc-800 text-white font-medium' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}
            `}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            <span>{item.label}</span>
            
            {/* Status indicators */}
            {status === 'drift' && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
              </span>
            )}
            {status === 'synced' && isActive && (
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="py-4">
      {renderItems(section.items)}
    </div>
  );
};