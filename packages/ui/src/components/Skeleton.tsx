import React from 'react';

// Base skeleton with subtle pulse animation
const SkeletonBase = ({ className = '', ...props }: React.ComponentProps<'div'>) => (
  <div className={`bg-zinc-800/50 rounded animate-pulse ${className}`} {...props} />
);

// Text line skeleton
export const SkeletonText = ({ 
  width = 'w-24', 
  height = 'h-4' 
}: { 
  width?: string; 
  height?: string;
}) => (
  <SkeletonBase className={`${width} ${height}`} />
);

// Heading skeleton
export const SkeletonHeading = ({ width = 'w-48' }: { width?: string }) => (
  <SkeletonBase className={`${width} h-6`} />
);

// Stat card skeleton
export const SkeletonStat = () => (
  <div className="space-y-2">
    <SkeletonBase className="w-20 h-3" />
    <SkeletonBase className="w-32 h-7" />
  </div>
);

// Card skeleton (generic container with content)
export const SkeletonCard = ({ 
  children, 
  className = '',
  ...props
}: React.ComponentProps<'div'>) => (
  <div className={`rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 ${className}`} {...props}>
    {children}
  </div>
);

// Chart skeleton
export const SkeletonChart = () => (
  <SkeletonCard className="p-0 overflow-hidden">
    <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center">
      <div className="space-y-1.5">
        <SkeletonBase className="w-32 h-4" />
        <SkeletonBase className="w-48 h-3" />
      </div>
      <div className="flex gap-1">
        <SkeletonBase className="w-10 h-6 rounded" />
        <SkeletonBase className="w-10 h-6 rounded" />
        <SkeletonBase className="w-10 h-6 rounded" />
      </div>
    </div>
    <div className="h-64 p-4 flex items-end gap-2">
      {/* Fake bar chart */}
      {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <SkeletonBase className="w-full rounded-t" style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
  </SkeletonCard>
);

// Table row skeleton
export const SkeletonTableRow = ({ columns = 5, ...props }: { columns?: number } & React.ComponentProps<'tr'>) => (
  <tr className="border-b border-zinc-800/50" {...props}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <SkeletonBase className={`h-4 ${i === 0 ? 'w-32' : 'w-16'}`} />
      </td>
    ))}
  </tr>
);

// Table skeleton
export const SkeletonTable = ({ rows = 4, columns = 5 }: { rows?: number; columns?: number }) => (
  <div className="rounded-lg border border-zinc-800 overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="border-b border-zinc-800 bg-zinc-900/50">
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-4 py-3 text-left">
              <SkeletonBase className="w-16 h-3" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// Activity row skeleton
export const SkeletonActivityRow = () => (
  <div className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0">
    <div className="flex items-center gap-3">
      <SkeletonBase className="w-1.5 h-1.5 rounded-full" />
      <SkeletonBase className="w-48 h-4" />
    </div>
    <div className="flex items-center gap-4">
      <SkeletonBase className="w-16 h-4" />
      <SkeletonBase className="w-12 h-3" />
    </div>
  </div>
);

// Progress bar skeleton
export const SkeletonProgress = () => (
  <div className="space-y-2">
    <div className="flex justify-between">
      <SkeletonBase className="w-20 h-3" />
      <SkeletonBase className="w-8 h-3" />
    </div>
    <SkeletonBase className="w-full h-1 rounded-full" />
  </div>
);

// Proposal card skeleton
export const SkeletonProposalCard = () => (
  <SkeletonCard className="p-0 overflow-hidden">
    <div className="p-5 pb-4 space-y-3">
      <div className="flex items-center gap-2">
        <SkeletonBase className="w-24 h-5 rounded" />
        <SkeletonBase className="w-16 h-4" />
      </div>
      <SkeletonBase className="w-3/4 h-5" />
      <div className="space-y-1.5">
        <SkeletonBase className="w-full h-3" />
        <SkeletonBase className="w-2/3 h-3" />
      </div>
    </div>
    <div className="px-5 pb-4 space-y-2">
      <div className="flex justify-between">
        <SkeletonBase className="w-24 h-3" />
        <SkeletonBase className="w-16 h-3" />
      </div>
      <SkeletonBase className="w-full h-1.5 rounded-full" />
    </div>
    <div className="border-t border-zinc-800 p-4 flex gap-2">
      <SkeletonBase className="flex-1 h-9 rounded" />
      <SkeletonBase className="flex-1 h-9 rounded" />
    </div>
  </SkeletonCard>
);

// Staggered fade-in wrapper
export const FadeIn = ({ 
  children, 
  delay = 0,
  duration = 300,
  className = ''
}: { 
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <div 
    className={`animate-fadeIn ${className}`}
    style={{ 
      animationDelay: `${delay}ms`,
      animationDuration: `${duration}ms`,
      animationFillMode: 'both'
    }}
  >
    {children}
  </div>
);

// Stagger container - applies incremental delays to children
export const Stagger = ({ 
  children, 
  staggerMs = 50,
  className = ''
}: { 
  children: React.ReactNode;
  staggerMs?: number;
  className?: string;
}) => (
  <div className={className}>
    {React.Children.map(children, (child, index) => (
      <FadeIn delay={index * staggerMs}>
        {child}
      </FadeIn>
    ))}
  </div>
);