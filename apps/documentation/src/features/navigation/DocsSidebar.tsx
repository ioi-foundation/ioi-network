import React from 'react';
import { FileCode2, FileText, FolderTree } from 'lucide-react';
import type { ConsoleSidebarGroup, ConsoleSidebarItem } from '@ioi/ui';
import { DocItem, SidebarSection } from '../../core/types';
import { SyncResult } from '../../core/utils';

interface SidebarProps {
  section: SidebarSection;
  activeDocId: string;
  onSelect: (id: string) => void;
  syncStatuses: Record<string, SyncResult>;
}

const renderStatus = (itemId: string, isActive: boolean, syncStatuses: Record<string, SyncResult>) => {
  const status = syncStatuses[itemId]?.status;

  if (status === 'drift') {
    return (
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
      </span>
    );
  }

  if (status === 'synced' && isActive) {
    return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />;
  }

  return null;
};

const mapDocItem = (
  item: DocItem,
  activeDocId: string,
  onSelect: (id: string) => void,
  syncStatuses: Record<string, SyncResult>,
  depth = 0
): ConsoleSidebarItem => {
  if (item.type === 'category') {
    return {
      id: item.id,
      label: item.label,
      icon: <FolderTree className="h-4 w-4" />,
      children: item.items?.map((child) => mapDocItem(child, activeDocId, onSelect, syncStatuses, depth + 1)),
      title: item.label,
    };
  }

  const isActive = item.id === activeDocId;

  return {
    id: item.id,
    label: item.label,
    icon: depth === 0 ? <FileText className="h-4 w-4" /> : <FileCode2 className="h-4 w-4" />,
    active: isActive,
    onSelect: () => onSelect(item.id),
    meta: renderStatus(item.id, isActive, syncStatuses),
    title: item.label,
  };
};

export const buildDocsSidebarGroups = ({
  section,
  activeDocId,
  onSelect,
  syncStatuses,
}: SidebarProps): ConsoleSidebarGroup[] => {
  const rootDocs = section.items.filter((item) => item.type === 'doc');
  const categories = section.items.filter((item) => item.type === 'category');
  const groups: ConsoleSidebarGroup[] = [];

  if (rootDocs.length) {
    groups.push({
      id: `${section.id}-basics`,
      label: 'Getting Started',
      items: rootDocs.map((item) => mapDocItem(item, activeDocId, onSelect, syncStatuses)),
    });
  }

  if (categories.length) {
    groups.push({
      id: `${section.id}-sections`,
      label: 'Reference Map',
      items: categories.map((item) => mapDocItem(item, activeDocId, onSelect, syncStatuses)),
    });
  }

  return groups;
};
