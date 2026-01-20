import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { MOCK_SLASHING_EVENTS } from '../../core/constants';
import { DialecticView } from './DialecticView';
import { 
  SkeletonCard, 
  SkeletonText,
  SkeletonProgress,
  FadeIn,
  Stagger
} from '@ioi/ui';

// Simulated fetch hook
function useSimulatedFetch<T>(data: T, delay: number = 800): { data: T | null; loading: boolean } {
  const [state, setState] = useState<{ data: T | null; loading: boolean }>({ 
    data: null, 
    loading: true 
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setState({ data, loading: false });
    }, delay);
    return () => clearTimeout(timer);
  }, [data, delay]);

  return state;
}

// Header stats
const headerStats = {
  jurors: 4021,
  disputes: 12
};

// Slashing row skeleton
const SlashingRowSkeleton = () => (
  <div className="flex items-start gap-3 py-3 border-b border-zinc-800/50 last:border-0">
    <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 mt-2 shrink-0 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <SkeletonText width="w-32" height="h-4" />
        <SkeletonText width="w-16" height="h-3" />
      </div>
      <SkeletonText width="w-48" height="h-3" />
      <div className="flex items-center gap-3">
        <SkeletonText width="w-20" height="h-3" />
        <SkeletonText width="w-24" height="h-3" />
      </div>
    </div>
  </div>
);

// Dialectic skeleton
const DialecticSkeleton = () => (
  <SkeletonCard className="p-0 overflow-hidden">
    <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
      <SkeletonText width="w-36" height="h-4" />
      <SkeletonText width="w-12" height="h-5" />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="p-3 rounded-lg border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <SkeletonText width="w-20" height="h-3" />
            <SkeletonText width="w-8" height="h-3" />
          </div>
          <SkeletonText width="w-full" height="h-3" />
          <SkeletonText width="w-3/4" height="h-3" />
          <div className="flex gap-1.5 pt-1">
            <SkeletonText width="w-20" height="h-4" />
            <SkeletonText width="w-24" height="h-4" />
          </div>
        </div>
      ))}
    </div>
    <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <SkeletonText width="w-12" height="h-3" />
          <SkeletonText width="w-32" height="h-4" />
        </div>
        <div className="text-right space-y-1">
          <SkeletonText width="w-16" height="h-3" />
          <SkeletonText width="w-12" height="h-6" />
        </div>
      </div>
    </div>
  </SkeletonCard>
);

// Slashing row component
const SlashingRow: React.FC<{ event: any }> = ({ event }) => (
  <div className="flex items-start gap-3 py-3 border-b border-zinc-800/50 last:border-0">
    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-white">{event.agentName}</span>
        <span className="text-xs text-zinc-600">{event.timestamp}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-0.5">{event.reason}</p>
      <div className="flex items-center gap-3 mt-1.5">
        <span className="text-xs font-mono text-rose-400">-{event.amount} IOI</span>
        <a 
          href="#" 
          className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 flex items-center gap-1"
        >
          {event.txHash}
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  </div>
);

export default function Judiciary() {
  // Simulated loading states
  const { data: statsData, loading: statsLoading } = useSimulatedFetch(headerStats, 300);
  const { data: slashingData, loading: slashingLoading } = useSimulatedFetch(MOCK_SLASHING_EVENTS, 600);
  const { data: dialecticReady, loading: dialecticLoading } = useSimulatedFetch(true, 800);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium text-white">Judiciary</h1>
            <p className="text-sm text-zinc-500 mt-1">Disputes, penalties, and arbitration records</p>
          </div>
          
          {statsLoading ? (
            <div className="flex gap-6">
              <div className="text-right space-y-1">
                <SkeletonText width="w-20" height="h-3" />
                <SkeletonText width="w-12" height="h-5" />
              </div>
              <div className="text-right space-y-1">
                <SkeletonText width="w-24" height="h-3" />
                <SkeletonText width="w-8" height="h-5" />
              </div>
            </div>
          ) : (
            <Stagger className="flex gap-6" staggerMs={80}>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Active Jurors</div>
                <div className="text-lg font-medium text-white">{statsData!.jurors.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Disputes (24h)</div>
                <div className="text-lg font-medium text-amber-400">{statsData!.disputes}</div>
              </div>
            </Stagger>
          )}
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slashing events */}
        <div className="lg:col-span-2 space-y-4">
          <FadeIn delay={100}>
            <h2 className="text-sm font-medium text-white">Recent Penalties</h2>
          </FadeIn>
          
          {slashingLoading ? (
            <SkeletonCard className="p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SlashingRowSkeleton key={i} />
              ))}
            </SkeletonCard>
          ) : (
            <FadeIn>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <Stagger staggerMs={80}>
                  {slashingData!.map(event => (
                    <SlashingRow key={event.id} event={event} />
                  ))}
                </Stagger>
                
                <button className="w-full mt-3 py-2 text-xs text-zinc-500 border border-dashed border-zinc-800 rounded hover:border-zinc-700 hover:text-zinc-400 transition-colors">
                  Load more
                </button>
              </div>
            </FadeIn>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <FadeIn delay={100}>
            <h2 className="text-sm font-medium text-white">Active Arbitration</h2>
          </FadeIn>
          
          {dialecticLoading ? (
            <DialecticSkeleton />
          ) : (
            <FadeIn>
              <DialecticView />
            </FadeIn>
          )}

          {/* AI alignment metric */}
          {dialecticLoading ? (
            <SkeletonCard className="p-4">
              <SkeletonProgress />
              <div className="mt-3">
                <SkeletonText width="w-full" height="h-3" />
              </div>
            </SkeletonCard>
          ) : (
            <FadeIn delay={200}>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-zinc-500">Human vs AI Divergence</span>
                  <span className="text-sm font-mono text-emerald-400">0.4%</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: '99.6%' }} />
                </div>
                <p className="text-[11px] text-zinc-600 mt-2">
                  AI judges align with human consensus 99.6% of the time
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}