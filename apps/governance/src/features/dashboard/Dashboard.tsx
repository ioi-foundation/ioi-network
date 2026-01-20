import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { 
  SkeletonStat, 
  SkeletonChart, 
  SkeletonCard, 
  SkeletonActivityRow,
  SkeletonProgress,
  FadeIn,
  Stagger
} from '@ioi/ui';

// Simulated data
const chartData = [
  { time: '00:00', value: 2400 },
  { time: '04:00', value: 1398 },
  { time: '08:00', value: 9800 },
  { time: '12:00', value: 3908 },
  { time: '16:00', value: 4800 },
  { time: '20:00', value: 3800 },
  { time: '23:59', value: 4300 },
];

const recentActivity = [
  { id: 1, type: 'stake', agent: 'Stripe Refund Bot v4', amount: '+2,400 IOI', time: '2m ago' },
  { id: 2, type: 'vote', proposal: 'PIP-104', action: 'Voted For', time: '8m ago' },
  { id: 3, type: 'slash', agent: 'FastHFT Executor', amount: '-5,000 IOI', time: '12m ago' },
];

const stats = [
  { label: 'Total Value Locked', value: '$542M', change: '2.4%', positive: true },
  { label: 'Active Agents', value: '12,403', change: '1.2%', positive: true },
  { label: 'Labor Gas (24h)', value: '45.2M', change: '12%', positive: true },
  { label: 'Avg Finality', value: '1.2s', change: null, positive: false },
];

const healthMetrics = [
  { label: 'Finality Time', value: '1.2s', percent: 92, color: 'bg-cyan-500' },
  { label: 'Validator Participation', value: '99.4%', percent: 99, color: 'bg-emerald-500', valueColor: 'text-emerald-400' },
  { label: 'Network Load', value: '78%', percent: 78, color: 'bg-amber-500', valueColor: 'text-amber-400' },
];

// Custom hook for simulated loading
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

// Components
const Stat = ({ label, value, change, positive }: { 
  label: string; 
  value: string; 
  change?: string | null;
  positive?: boolean;
  key?: React.Key;
}) => (
  <div className="space-y-1">
    <p className="text-[13px] text-zinc-500">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-medium text-white tracking-tight">{value}</span>
      {change && (
        <span className={`flex items-center text-xs font-medium ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </span>
      )}
    </div>
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border border-zinc-800 bg-zinc-900/50 ${className}`}>
    {children}
  </div>
);

const ActivityRow = ({ item }: { item: typeof recentActivity[0]; key?: React.Key }) => (
  <div className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0">
    <div className="flex items-center gap-3">
      <div className={`w-1.5 h-1.5 rounded-full ${
        item.type === 'stake' ? 'bg-emerald-400' : 
        item.type === 'vote' ? 'bg-blue-400' : 'bg-rose-400'
      }`} />
      <p className="text-sm text-zinc-200">
        {item.type === 'stake' && `Staked on ${item.agent}`}
        {item.type === 'vote' && `${item.action} on ${item.proposal}`}
        {item.type === 'slash' && `${item.agent} slashed`}
      </p>
    </div>
    <div className="flex items-center gap-4">
      {item.amount && (
        <span className={`text-sm font-mono ${item.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
          {item.amount}
        </span>
      )}
      <span className="text-xs text-zinc-600">{item.time}</span>
    </div>
  </div>
);

const ProgressBar = ({ value, color = 'bg-zinc-600' }: { value: number; color?: string }) => (
  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} 
      style={{ width: `${value}%` }} 
    />
  </div>
);

// Skeleton states for each section
const StatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonStat key={i} />
    ))}
  </div>
);

const ChartSkeleton = () => <SkeletonChart />;

const HealthSkeleton = () => (
  <SkeletonCard>
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonProgress key={i} />
      ))}
    </div>
  </SkeletonCard>
);

const ActivitySkeleton = () => (
  <SkeletonCard className="p-0">
    <div className="px-5 py-4 border-b border-zinc-800 flex justify-between">
      <div className="w-24 h-4 bg-zinc-800/50 rounded animate-pulse" />
      <div className="w-16 h-4 bg-zinc-800/50 rounded animate-pulse" />
    </div>
    <div className="px-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonActivityRow key={i} />
      ))}
    </div>
  </SkeletonCard>
);

// Main Dashboard component
export default function Dashboard() {
  // Simulate different loading times for each section
  const { data: statsData, loading: statsLoading } = useSimulatedFetch(stats, 400);
  const { data: chartDataLoaded, loading: chartLoading } = useSimulatedFetch(chartData, 700);
  const { data: healthData, loading: healthLoading } = useSimulatedFetch(healthMetrics, 500);
  const { data: activityData, loading: activityLoading } = useSimulatedFetch(recentActivity, 600);

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div>
          <h1 className="text-xl font-medium text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Network overview and recent activity</p>
        </div>
      </FadeIn>

      {/* Stats */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerMs={50}>
          {statsData!.map((stat, i) => (
            <Stat key={i} {...stat} />
          ))}
        </Stagger>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          {chartLoading ? (
            <ChartSkeleton />
          ) : (
            <FadeIn>
              <Card className="p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-medium text-white">Network Throughput</h2>
                      <p className="text-xs text-zinc-500 mt-0.5">Computational output over time</p>
                    </div>
                    <div className="flex gap-1">
                      {['24H', '7D', '30D'].map((period, i) => (
                        <button 
                          key={period}
                          className={`px-2.5 py-1 text-xs rounded transition-colors ${
                            i === 1 ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="h-64 px-2 pb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartDataLoaded!} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="time" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#52525b', fontSize: 11 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#52525b', fontSize: 11 }}
                        tickFormatter={(val) => `${val/1000}k`}
                        dx={-10}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#06b6d4" 
                        strokeWidth={1.5}
                        fill="url(#chartGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </FadeIn>
          )}
        </div>

        {/* Health metrics */}
        {healthLoading ? (
          <HealthSkeleton />
        ) : (
          <FadeIn>
            <Card className="p-5">
              <h2 className="text-sm font-medium text-white mb-4">Consensus Health</h2>
              
              <Stagger className="space-y-5" staggerMs={80}>
                {healthData!.map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-zinc-500">{metric.label}</span>
                      <span className={`font-mono ${metric.valueColor || 'text-white'}`}>{metric.value}</span>
                    </div>
                    <ProgressBar value={metric.percent} color={metric.color} />
                  </div>
                ))}
              </Stagger>

              {/* Alert */}
              <FadeIn delay={300}>
                <div className="mt-6 pt-5 border-t border-zinc-800">
                  <div className="flex items-start gap-3 p-3 rounded bg-rose-500/5 border border-rose-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs text-rose-200 font-medium">Slashing Event</p>
                      <p className="text-xs text-rose-400/70 mt-0.5">Agent #882 equivocation detected</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </Card>
          </FadeIn>
        )}
      </div>

      {/* Recent activity */}
      {activityLoading ? (
        <ActivitySkeleton />
      ) : (
        <FadeIn>
          <Card className="p-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-medium text-white">Recent Activity</h2>
              <button className="flex items-center text-xs text-zinc-500 hover:text-white transition-colors">
                View all
                <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            <div className="px-5">
              <Stagger staggerMs={60}>
                {activityData!.map(item => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </Stagger>
            </div>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}