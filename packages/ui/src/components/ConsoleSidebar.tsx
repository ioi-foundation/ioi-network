import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ConsoleSidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onSelect?: () => void;
  active?: boolean;
  badge?: string;
  meta?: React.ReactNode;
  children?: ConsoleSidebarItem[];
  defaultExpanded?: boolean;
  title?: string;
}

export interface ConsoleSidebarGroup {
  id: string;
  label?: string;
  items: ConsoleSidebarItem[];
}

export interface ConsoleSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  title: string;
  version?: string;
  headerIcon?: React.ReactNode;
  onHeaderClick?: () => void;
  groups: ConsoleSidebarGroup[];
  footer?: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  expandedWidthClassName?: string;
  collapsedWidthClassName?: string;
  className?: string;
}

const collectDefaultExpandedIds = (items: ConsoleSidebarItem[], ids = new Set<string>()) => {
  items.forEach((item) => {
    if (item.defaultExpanded) ids.add(item.id);
    if (item.children?.length) collectDefaultExpandedIds(item.children, ids);
  });
  return ids;
};

const collectActiveBranchIds = (items: ConsoleSidebarItem[], ids = new Set<string>()) => {
  const visit = (item: ConsoleSidebarItem): boolean => {
    const childIsActive = item.children?.some(visit) ?? false;
    const branchIsActive = Boolean(item.active || childIsActive);

    if (branchIsActive && item.children?.length) ids.add(item.id);
    return branchIsActive;
  };

  items.forEach(visit);
  return ids;
};

const collectItemIds = (items: ConsoleSidebarItem[], ids = new Set<string>()) => {
  items.forEach((item) => {
    ids.add(item.id);
    if (item.children?.length) collectItemIds(item.children, ids);
  });
  return ids;
};

const setsMatch = (left: Set<string>, right: Set<string>) => {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
};

export const ConsoleSidebar = ({
  mobileOpen,
  onCloseMobile,
  title,
  version,
  headerIcon,
  onHeaderClick,
  groups,
  footer,
  collapsed = false,
  onToggleCollapsed,
  expandedWidthClassName = 'w-64',
  collapsedWidthClassName = 'w-16',
  className = '',
}: ConsoleSidebarProps) => {
  const canCollapse = typeof onToggleCollapsed === 'function';
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const defaults = groups.reduce((ids, group) => collectDefaultExpandedIds(group.items, ids), new Set<string>());
    const active = groups.reduce((ids, group) => collectActiveBranchIds(group.items, ids), new Set<string>());
    active.forEach((id) => defaults.add(id));
    return defaults;
  });

  const activeBranchIds = useMemo(
    () => groups.reduce((ids, group) => collectActiveBranchIds(group.items, ids), new Set<string>()),
    [groups]
  );

  const itemIds = useMemo(
    () => groups.reduce((ids, group) => collectItemIds(group.items, ids), new Set<string>()),
    [groups]
  );

  useEffect(() => {
    const defaults = groups.reduce((ids, group) => collectDefaultExpandedIds(group.items, ids), new Set<string>());

    setExpanded((prev) => {
      const next = new Set<string>();

      prev.forEach((id) => {
        if (itemIds.has(id)) next.add(id);
      });
      defaults.forEach((id) => next.add(id));
      activeBranchIds.forEach((id) => next.add(id));

      return setsMatch(prev, next) ? prev : next;
    });
  }, [groups, activeBranchIds, itemIds]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleLeafClick = (item: ConsoleSidebarItem) => {
    item.onSelect?.();
    onCloseMobile();
  };

  const renderItem = (item: ConsoleSidebarItem, depth = 0): React.ReactNode => {
    const hasChildren = Boolean(item.children?.length);
    const isExpanded = expanded.has(item.id);
    const isActive = Boolean(item.active);
    const isBranchActive = activeBranchIds.has(item.id);
    const itemPadding = collapsed ? undefined : { paddingLeft: `${12 + depth * 14}px` };
    const itemTitle = collapsed ? item.title || item.label : item.title;
    const baseClasses = [
      'group relative flex w-full items-center gap-3 rounded-lg border text-sm transition-all duration-150',
      collapsed ? 'h-10 justify-center px-0' : 'min-h-10 justify-start px-3 py-2 text-left',
      isActive
        ? 'border-zinc-700 bg-zinc-800/90 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
        : isBranchActive
          ? 'border-zinc-800 bg-zinc-900/70 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-900'
          : 'border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900/80 hover:text-zinc-100',
    ].join(' ');

    if (hasChildren) {
      return (
        <div key={item.id} className="space-y-1">
          <button
            type="button"
            onClick={() => toggleExpanded(item.id)}
            className={baseClasses}
            style={itemPadding}
            title={itemTitle}
            aria-expanded={isExpanded}
          >
            {item.icon && <span className="shrink-0 text-zinc-500 group-hover:text-zinc-200">{item.icon}</span>}
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1 truncate text-left font-medium">{item.label}</span>
                {item.badge && (
                  <span className="rounded border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    {item.badge}
                  </span>
                )}
                {item.meta}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                />
              </>
            )}
          </button>

          {!collapsed && isExpanded && item.children && (
            <div className="relative ml-4 space-y-1 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-px before:bg-zinc-800">
              {item.children.map((child) => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const content = (
      <>
        {item.icon && <span className="shrink-0 text-zinc-500 group-hover:text-zinc-200">{item.icon}</span>}
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-left font-medium">{item.label}</span>
            {item.badge && (
              <span className="rounded border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                {item.badge}
              </span>
            )}
            {item.meta}
          </>
        )}
      </>
    );

    if (item.href) {
      return (
        <a
          key={item.id}
          href={item.href}
          onClick={() => handleLeafClick(item)}
          className={baseClasses}
          style={itemPadding}
          title={itemTitle}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleLeafClick(item)}
        className={baseClasses}
        style={itemPadding}
        title={itemTitle}
      >
        {content}
      </button>
    );
  };

  const HeaderTag = onHeaderClick ? 'button' : 'div';

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed left-0 top-9 bottom-0 z-50 flex transform flex-col border-r border-zinc-800 bg-zinc-950/95 text-zinc-100 backdrop-blur-xl transition-all duration-200 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? collapsedWidthClassName : expandedWidthClassName,
          className,
        ].join(' ')}
      >
        {canCollapse && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="absolute -right-3 top-16 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 transition-colors hover:text-white lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        )}

        <HeaderTag
          {...(onHeaderClick ? { onClick: onHeaderClick, type: 'button' as const } : {})}
          className={[
            'flex h-14 items-center border-b border-zinc-800 px-4 text-left transition-colors',
            onHeaderClick ? 'hover:bg-zinc-900' : '',
            collapsed ? 'justify-center px-0' : 'justify-between',
          ].join(' ')}
          title={collapsed ? title : undefined}
        >
          {collapsed ? (
            headerIcon ?? <span className="text-sm font-semibold text-zinc-300">{title.charAt(0)}</span>
          ) : (
            <>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight text-white">{title}</div>
                <div className="text-[11px] text-zinc-500">Workspace navigation</div>
              </div>
              {version && (
                <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-500">
                  {version}
                </span>
              )}
            </>
          )}
        </HeaderTag>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="space-y-1.5">
                {!collapsed && group.label && (
                  <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    {group.label}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => renderItem(item))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {footer && <div className="border-t border-zinc-800">{footer}</div>}
      </aside>
    </>
  );
};
