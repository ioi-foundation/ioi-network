# Codebase Snapshot: governance
Created: Mon Jan 19 07:51:08 AM EST 2026
Target: /home/levijosman/depin-network/codebase/ioi-network/apps/governance
Line threshold for included files: 1800

## Summary Statistics

* Total files: 11193
* Total directories: 554

### Directory: /home/levijosman/depin-network/codebase/ioi-network/apps/governance

#### Directory: assets

##### File: assets/ioi-logo-dark.svg
##*Size: 8.0K, Lines: 73, Type: SVG Scalable Vector Graphics image*

##*File content not included (exceeds threshold or non-text file)*

##### File: assets/logo-final.svg
##*Size: 8.0K, Lines: 123, Type: SVG Scalable Vector Graphics image*

##*File content not included (exceeds threshold or non-text file)*

#### Directory: context

##### File: context/NetworkContext.tsx
##*Size: 8.0K, Lines: 258, Type: Java source, ASCII text*

```
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MOCK_AGENTS, MOCK_PROPOSALS } from '../core/constants';
import { Agent, Proposal } from '../core/types';
import { useToast } from './ToastContext';

// Pending transaction types
interface PendingVote {
  proposalId: string;
  side: 'for' | 'against';
  amount: number;
}

interface PendingStake {
  agentId: string;
  amount: number;
}

interface UserIdentity {
  economicDid: string;
  operationalDid: string;
  reputation: number;
  guardianStatus: 'Secure Enclave' | 'Software' | 'Nitro TEE';
}

interface NetworkContextType {
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  user: UserIdentity | null;
  balance: number;
  agents: Agent[];
  proposals: Proposal[];
  
  // Optimistic state
  pendingVotes: Map<string, PendingVote>;
  pendingStakes: Map<string, PendingStake>;
  
  // Actions that return promises
  stakeOnAgent: (agentId: string, amount: number) => Promise<boolean>;
  voteOnProposal: (proposalId: string, side: 'for' | 'against') => Promise<boolean>;
  
  // Helpers
  isVotePending: (proposalId: string) => boolean;
  isStakePending: (agentId: string) => boolean;
  getOptimisticProposal: (proposalId: string) => Proposal | undefined;
  getOptimisticAgent: (agentId: string) => Agent | undefined;
  getOptimisticBalance: () => number;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Simulate network delay
const simulateTransaction = (successRate = 0.95): Promise<boolean> => {
  return new Promise((resolve) => {
    const delay = 1500 + Math.random() * 1000; // 1.5-2.5s
    setTimeout(() => {
      resolve(Math.random() < successRate);
    }, delay);
  });
};

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(15000);
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [user, setUser] = useState<UserIdentity | null>(null);
  
  // Pending transactions
  const [pendingVotes, setPendingVotes] = useState<Map<string, PendingVote>>(new Map());
  const [pendingStakes, setPendingStakes] = useState<Map<string, PendingStake>>(new Map());
  
  const { addToast } = useToast();

  const connectWallet = useCallback(async () => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsConnected(true);
    setUser({
      economicDid: "0x71C...9A23",
      operationalDid: "did:ioi:device:8f92...",
      reputation: 98,
      guardianStatus: 'Secure Enclave'
    });
    addToast('success', 'Connected', 'Wallet connected successfully');
  }, [addToast]);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setUser(null);
    setPendingVotes(new Map());
    setPendingStakes(new Map());
    addToast('info', 'Disconnected', 'Wallet disconnected');
  }, [addToast]);

  // Optimistic staking
  const stakeOnAgent = useCallback(async (agentId: string, amount: number): Promise<boolean> => {
    if (balance < amount) {
      addToast('error', 'Insufficient Balance', `Need ${amount} IOI, have ${balance}`);
      return false;
    }

    // Add to pending
    setPendingStakes(prev => {
      const next = new Map(prev);
      next.set(agentId, { agentId, amount });
      return next;
    });

    addToast('info', 'Transaction Pending', 'Submitting stake to network...');

    // Simulate transaction
    const success = await simulateTransaction();

    // Remove from pending
    setPendingStakes(prev => {
      const next = new Map(prev);
      next.delete(agentId);
      return next;
    });

    if (success) {
      // Commit the change
      setBalance(prev => prev - amount);
      setAgents(prev => prev.map(agent => {
        if (agent.id === agentId) {
          return { ...agent, totalStaked: agent.totalStaked + amount };
        }
        return agent;
      }));
      addToast('success', 'Stake Confirmed', `Successfully staked ${amount} IOI`);
      return true;
    } else {
      addToast('error', 'Transaction Failed', 'Stake was not confirmed. Please try again.');
      return false;
    }
  }, [balance, addToast]);

  // Optimistic voting
  const voteOnProposal = useCallback(async (proposalId: string, side: 'for' | 'against'): Promise<boolean> => {
    const voteWeight = balance;

    // Add to pending
    setPendingVotes(prev => {
      const next = new Map(prev);
      next.set(proposalId, { proposalId, side, amount: voteWeight });
      return next;
    });

    addToast('info', 'Vote Pending', 'Signing and submitting vote...');

    // Simulate transaction
    const success = await simulateTransaction();

    // Remove from pending
    setPendingVotes(prev => {
      const next = new Map(prev);
      next.delete(proposalId);
      return next;
    });

    if (success) {
      // Commit the change
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            votes: { ...p.votes, [side]: p.votes[side] + voteWeight }
          };
        }
        return p;
      }));
      addToast('success', 'Vote Confirmed', `Your vote has been recorded on-chain`);
      return true;
    } else {
      addToast('error', 'Vote Failed', 'Transaction was not confirmed. Please try again.');
      return false;
    }
  }, [balance, addToast]);

  // Helper functions
  const isVotePending = useCallback((proposalId: string) => {
    return pendingVotes.has(proposalId);
  }, [pendingVotes]);

  const isStakePending = useCallback((agentId: string) => {
    return pendingStakes.has(agentId);
  }, [pendingStakes]);

  // Get proposal with optimistic vote applied
  const getOptimisticProposal = useCallback((proposalId: string): Proposal | undefined => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return undefined;

    const pending = pendingVotes.get(proposalId);
    if (!pending) return proposal;

    return {
      ...proposal,
      votes: {
        ...proposal.votes,
        [pending.side]: proposal.votes[pending.side] + pending.amount
      }
    };
  }, [proposals, pendingVotes]);

  // Get agent with optimistic stake applied
  const getOptimisticAgent = useCallback((agentId: string): Agent | undefined => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return undefined;

    const pending = pendingStakes.get(agentId);
    if (!pending) return agent;

    return {
      ...agent,
      totalStaked: agent.totalStaked + pending.amount
    };
  }, [agents, pendingStakes]);

  // Get balance with pending stakes deducted
  const getOptimisticBalance = useCallback((): number => {
    let optimistic = balance;
    pendingStakes.forEach(stake => {
      optimistic -= stake.amount;
    });
    return optimistic;
  }, [balance, pendingStakes]);

  return (
    <NetworkContext.Provider value={{
      isConnected,
      connectWallet,
      disconnectWallet,
      user,
      balance,
      agents,
      proposals,
      pendingVotes,
      pendingStakes,
      stakeOnAgent,
      voteOnProposal,
      isVotePending,
      isStakePending,
      getOptimisticProposal,
      getOptimisticAgent,
      getOptimisticBalance,
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) throw new Error("useNetwork must be used within a NetworkProvider");
  return context;
};```

##### File: context/ToastContext.tsx
##*Size: 4.0K, Lines: 83, Type: Java source, ASCII text*

```
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Check, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  addToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
    }
  };

  const getColors = (type: ToastType) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'error': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'info': return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto w-72 border rounded-lg p-3 shadow-lg flex items-start gap-3 animate-in slide-in-from-right-full duration-200 ${getColors(toast.type)}`}
          >
            <div className="shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white">{toast.title}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="shrink-0 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};```

#### Directory: core

##### File: core/constants.ts
##*Size: 4.0K, Lines: 108, Type: Java source, ASCII text*

```typescript
import { Agent, EpochInfo, Proposal, ProposalType, SlashingEvent } from './types';

export const CURRENT_EPOCH: EpochInfo = {
  current: 42,
  name: "Post-Quantum Migration Phase",
  progress: 65,
  phase: 'Voting',
  nextPhaseTime: '14h 22m'
};

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "PIP-104",
    type: ProposalType.PROTOCOL_UPGRADE,
    title: "Upgrade Consensus to A-DMFT v1.2",
    description: "Implements optimistic pipelining for the Triadic Kernel to reduce finality latency.",
    impact: "Reduces block time to 2s. Increases throughput by 15%.",
    status: 'Active',
    votes: {
      for: 14500000,
      against: 230000,
      quorum: 0.65
    },
    endDate: "2024-11-15T00:00:00Z"
  },
  {
    id: "JCP-009",
    type: ProposalType.JUDICIARY_CALIBRATION,
    title: "Update Recommended_Juror_Model_CID",
    description: "Transitioning the default arbitration model from Llama-3-70b to DeepSeek-Coder-v2 for enhanced smart contract dispute resolution.",
    impact: "Improves code interpretation accuracy in disputes.",
    technicalDetails: {
      label: "Model Weights CID",
      oldHash: "QmX7...9kL2",
      newHash: "bafy...p8nQ"
    },
    status: 'Active',
    votes: {
      for: 8900000,
      against: 4500000,
      quorum: 0.45
    },
    endDate: "2024-11-18T00:00:00Z"
  }
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: "ag_1",
    name: "Stripe Refund Bot v4",
    did: "did:ioi:dao-fin-0x1a...",
    riskTier: "Tier 2 (Bonded)",
    securityScore: 98,
    apy: 12.4,
    totalStaked: 4500000,
    status: 'Active'
  },
  {
    id: "ag_2",
    name: "AlphaMedical Diagnostician",
    did: "did:ioi:med-grp-0x9b...",
    riskTier: "Tier 1 (Critical)",
    securityScore: 99,
    apy: 8.5,
    totalStaked: 12000000,
    status: 'Active'
  },
  {
    id: "ag_3",
    name: "OpenMarket Arbiter",
    did: "did:ioi:mkt-maker-0x3c...",
    riskTier: "Tier 3 (Speculative)",
    securityScore: 82,
    apy: 24.1,
    totalStaked: 1250000,
    status: 'Bonded'
  },
  {
    id: "ag_4",
    name: "Logistics Router Delta",
    did: "did:ioi:log-net-0x4d...",
    riskTier: "Tier 2 (Bonded)",
    securityScore: 94,
    apy: 11.2,
    totalStaked: 3100000,
    status: 'Active'
  }
];

export const MOCK_SLASHING_EVENTS: SlashingEvent[] = [
  {
    id: "sl_99",
    agentId: "ag_88",
    agentName: "FastHFT Executor",
    amount: 5000,
    reason: "Equivocation (Double Signing)",
    timestamp: "10 mins ago",
    txHash: "0x4a...9f21"
  },
  {
    id: "sl_98",
    agentId: "ag_12",
    agentName: "ContentMod v1",
    amount: 150,
    reason: "Policy Violation (Censorship)",
    timestamp: "2 hrs ago",
    txHash: "0x1b...3c44"
  }
];```

##### File: core/types.ts
##*Size: 4.0K, Lines: 76, Type: ASCII text*

```typescript
export enum ProposalType {
  PROTOCOL_UPGRADE = "Protocol Upgrade",
  JUDICIARY_CALIBRATION = "Judiciary Calibration",
  TREASURY_ALLOCATION = "Treasury Allocation"
}

export interface Proposal {
  id: string;
  type: ProposalType;
  title: string;
  description: string;
  impact: string;
  technicalDetails?: {
    label: string;
    oldHash: string;
    newHash: string;
  };
  status: 'Active' | 'Passed' | 'Rejected' | 'Pending';
  votes: {
    for: number;
    against: number;
    quorum: number;
  };
  endDate: string;
}

export interface Agent {
  id: string;
  name: string;
  did: string;
  riskTier: string;
  securityScore: number;
  apy: number;
  totalStaked: number;
  status: 'Active' | 'Slashed' | 'Bonded';
}

export interface SlashingEvent {
  id: string;
  agentId: string;
  agentName: string;
  amount: number;
  reason: string;
  timestamp: string;
  txHash: string;
}

export interface EpochInfo {
  current: number;
  name: string;
  progress: number; // 0-100
  phase: 'Registration' | 'Snapshot' | 'Voting' | 'Execution';
  nextPhaseTime: string;
}

// --- New Identity & Connection Types ---

export enum ConnectionMode {
  DISCONNECTED = "Disconnected",
  LOCAL_AUTOPILOT = "Local Autopilot (Mode 0)",
  REMOTE_GATEWAY = "Remote Gateway (Mode 2)"
}

export interface UserIdentity {
  economicDid: string; // 0x... (Mainnet)
  operationalDid: string; // did:ioi:device... (Local)
  reputation: number; // Veridicality Score
  guardianStatus: 'Secure Enclave' | 'Software' | 'Nitro TEE';
}

export interface BlockHeader {
  height: number;
  hash: string;
  mirror: 'A' | 'B';
  finalized: boolean;
  timestamp: string;
}```

#### Directory: features

##### Directory: features/dashboard

###### File: features/dashboard/Dashboard.tsx
###*Size: 12K, Lines: 315, Type: Java source, ASCII text*

```
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
} from '../../shared/Skeleton';

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
}```

##### Directory: features/governance

###### File: features/governance/Governance.tsx
###*Size: 12K, Lines: 318, Type: Java source, Unicode text, UTF-8 text*

```
import React, { useState, useEffect } from 'react';
import { Clock, Check, ChevronRight, ExternalLink } from 'lucide-react';
import { CURRENT_EPOCH, MOCK_PROPOSALS } from '../../core/constants';
import { Proposal } from '../../core/types';
import { useNetwork } from '../../context/NetworkContext';
import { 
  SkeletonCard, 
  SkeletonProposalCard,
  SkeletonText,
  FadeIn,
  Stagger
} from '../../shared/Skeleton';
import { Button, Spinner } from '../../shared/UIComponents';

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

// Epoch header skeleton
const EpochHeaderSkeleton = () => (
  <SkeletonCard className="mb-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div className="space-y-2">
        <div className="flex gap-2">
          <SkeletonText width="w-12" height="h-4" />
          <SkeletonText width="w-8" height="h-4" />
        </div>
        <SkeletonText width="w-48" height="h-5" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonText width="w-24" height="h-4" />
        <SkeletonText width="w-16" height="h-5" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2">
            <SkeletonText width="w-6" height="h-6" />
            <SkeletonText width="w-16" height="h-3" />
          </div>
          {i < 3 && <SkeletonText width="w-12" height="h-px" />}
        </React.Fragment>
      ))}
    </div>
  </SkeletonCard>
);

// Epoch progress component
const EpochHeader = () => {
  const phases = ['Registration', 'Snapshot', 'Voting', 'Execution'];
  const currentPhaseIndex = 2;
  
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">Epoch</span>
            <span className="text-sm font-mono text-white">{CURRENT_EPOCH.current}</span>
          </div>
          <h2 className="text-lg font-medium text-white mt-1">{CURRENT_EPOCH.name}</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-500">Next phase in</span>
          <span className="font-mono text-white">{CURRENT_EPOCH.nextPhaseTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {phases.map((phase, idx) => (
          <React.Fragment key={phase}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                idx < currentPhaseIndex 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : idx === currentPhaseIndex
                    ? 'bg-white text-zinc-900'
                    : 'bg-zinc-800 text-zinc-500'
              }`}>
                {idx < currentPhaseIndex ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <span className={`text-xs ${
                idx === currentPhaseIndex ? 'text-white font-medium' : 'text-zinc-500'
              }`}>
                {phase}
              </span>
            </div>
            {idx < phases.length - 1 && (
              <div className={`flex-1 h-px max-w-12 ${
                idx < currentPhaseIndex ? 'bg-cyan-500/40' : 'bg-zinc-800'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Proposal card with optimistic UI
const ProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => {
  const { 
    voteOnProposal, 
    isConnected, 
    connectWallet, 
    isVotePending,
    getOptimisticProposal,
    balance
  } = useNetwork();
  
  const isPending = isVotePending(proposal.id);
  const displayProposal = getOptimisticProposal(proposal.id) || proposal;
  
  const totalVotes = displayProposal.votes.for + displayProposal.votes.against;
  const forPercent = totalVotes > 0 ? (displayProposal.votes.for / totalVotes) * 100 : 50;
  
  const handleVote = async (side: 'for' | 'against') => {
    await voteOnProposal(proposal.id, side);
  };
  
  return (
    <div className={`rounded-lg border bg-zinc-900/50 overflow-hidden transition-all duration-300 ${
      isPending 
        ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
        : 'border-zinc-800 hover:border-zinc-700'
    }`}>
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              proposal.type.includes('Upgrade') 
                ? 'bg-violet-500/10 text-violet-400' 
                : 'bg-blue-500/10 text-blue-400'
            }`}>
              {proposal.type}
            </span>
            <span className="text-xs text-zinc-600 font-mono">{proposal.id}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {isPending ? (
              <>
                <Spinner className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400">Confirming...</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-zinc-400">{proposal.status}</span>
              </>
            )}
          </div>
        </div>

        <h3 className="text-[15px] font-medium text-white leading-snug">{proposal.title}</h3>
        <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{proposal.description}</p>
      </div>

      {proposal.technicalDetails && (
        <div className="mx-5 mb-4 p-3 rounded bg-zinc-950 border border-zinc-800">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-1.5">
            <span>{proposal.technicalDetails.label}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-zinc-600 line-through">{proposal.technicalDetails.oldHash}</span>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-cyan-400">{proposal.technicalDetails.newHash}</span>
          </div>
        </div>
      )}

      <div className="mx-5 mb-4 text-sm text-zinc-400">
        <span className="text-zinc-500">Impact:</span> {proposal.impact}
      </div>

      {/* Voting progress with optimistic update */}
      <div className="px-5 pb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-zinc-500">Quorum: {(proposal.votes.quorum * 100).toFixed(0)}%</span>
          <span className={`font-mono ${isPending ? 'text-cyan-400' : 'text-zinc-400'}`}>
            {isPending && <Spinner className="w-3 h-3 inline mr-1" />}
            {(totalVotes / 1000000).toFixed(1)}M votes
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
          <div 
            className={`h-full transition-all duration-500 ${isPending ? 'bg-cyan-400' : 'bg-cyan-500'}`}
            style={{ width: `${forPercent}%` }} 
          />
          <div 
            className="h-full bg-zinc-600 transition-all duration-500" 
            style={{ width: `${100 - forPercent}%` }} 
          />
        </div>
        <div className="flex justify-between text-[11px] mt-2 font-mono">
          <span className={isPending ? 'text-cyan-400' : 'text-cyan-500'}>
            {(displayProposal.votes.for / 1000000).toFixed(1)}M For
          </span>
          <span className="text-zinc-500">
            {(displayProposal.votes.against / 1000000).toFixed(1)}M Against
          </span>
        </div>
      </div>

      {/* Vote buttons with loading states */}
      <div className="border-t border-zinc-800 p-4 flex gap-2">
        {isConnected ? (
          <>
            <Button
              variant="primary"
              loading={isPending}
              onClick={() => handleVote('for')}
              className="flex-1"
              disabled={isPending}
            >
              Vote For
            </Button>
            <Button
              variant="secondary"
              loading={isPending}
              onClick={() => handleVote('against')}
              className="flex-1"
              disabled={isPending}
            >
              Vote Against
            </Button>
          </>
        ) : (
          <button 
            onClick={() => connectWallet()}
            className="flex-1 py-2 rounded border border-dashed border-zinc-700 text-zinc-500 text-sm hover:text-white hover:border-zinc-500 transition-colors"
          >
            Connect to vote
          </button>
        )}
      </div>
      
      {/* Voting power indicator */}
      {isConnected && !isPending && (
        <div className="px-4 pb-3 text-[10px] text-zinc-600 text-center">
          Your voting power: {balance.toLocaleString()} IOI
        </div>
      )}
    </div>
  );
};

export default function Governance() {
  const { proposals } = useNetwork();
  
  const { data: epochData, loading: epochLoading } = useSimulatedFetch(CURRENT_EPOCH, 300);
  const { data: proposalsData, loading: proposalsLoading } = useSimulatedFetch(MOCK_PROPOSALS, 600);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-medium text-white">Governance</h1>
            <p className="text-sm text-zinc-500 mt-1">Protocol upgrades and judiciary calibration</p>
          </div>
          <a href="#" className="hidden md:flex items-center text-sm text-zinc-500 hover:text-white transition-colors">
            <span>Constitution</span>
            <ExternalLink className="w-3 h-3 ml-1.5" />
          </a>
        </div>
      </FadeIn>

      {/* Epoch */}
      {epochLoading ? (
        <EpochHeaderSkeleton />
      ) : (
        <FadeIn>
          <EpochHeader />
        </FadeIn>
      )}

      {/* Section header */}
      <FadeIn delay={200}>
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-white">Active Proposals</h2>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
            {proposalsLoading ? '—' : proposalsData?.length}
          </span>
        </div>
      </FadeIn>
      
      {/* Proposals grid */}
      {proposalsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonProposalCard key={i} />
          ))}
        </div>
      ) : (
        <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-4" staggerMs={100}>
          {proposalsData!.map(prop => (
            <ProposalCard key={prop.id} proposal={prop} />
          ))}
        </Stagger>
      )}
    </div>
  );
}```

##### Directory: features/judiciary

###### File: features/judiciary/DialecticView.tsx
###*Size: 4.0K, Lines: 86, Type: Java source, ASCII text*

```
import React from 'react';

interface Argument {
  role: 'Prosecutor' | 'Defender';
  claim: string;
  citations: string[];
  confidence: number;
}

export const DialecticView = () => {
  const debateFlow: Argument[] = [
    {
      role: 'Prosecutor',
      claim: "Agent failed 'Hard Constraint Check' on latency. Receipt timestamp > Max_Deadline.",
      citations: ["rcpt_0x8a...99", "policy_hash_0x1..."],
      confidence: 0.98
    },
    {
      role: 'Defender',
      claim: "Provider Node clock drift detected. Cross-referenced with Oracle Time Anchor.",
      citations: ["oracle_chk_0x4..."],
      confidence: 0.65
    }
  ];

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Dialectic Verification</h3>
        <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
          Tier 4
        </span>
      </div>

      {/* Debate flow */}
      <div className="p-4 space-y-3">
        {debateFlow.map((arg, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-lg border ${
              arg.role === 'Prosecutor' 
                ? 'bg-rose-500/5 border-rose-500/10' 
                : 'bg-emerald-500/5 border-emerald-500/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-medium uppercase tracking-wide ${
                arg.role === 'Prosecutor' ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {arg.role}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {(arg.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{arg.claim}</p>
            <div className="flex gap-1.5 mt-2">
              {arg.citations.map(cite => (
                <span 
                  key={cite} 
                  className="text-[9px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded"
                >
                  {cite}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Verdict</div>
            <div className="text-sm font-medium text-white">Slash Provider Bond</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Confidence</div>
            <div className="text-lg font-mono text-cyan-400">0.92</div>
          </div>
        </div>
      </div>
    </div>
  );
};```

###### File: features/judiciary/Judiciary.tsx
###*Size: 12K, Lines: 229, Type: HTML document, ASCII text*

```
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
} from '../../shared/Skeleton';

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
}```

##### Directory: features/underwriting

###### File: features/underwriting/AgentHierarchy.tsx
###*Size: 4.0K, Lines: 60, Type: Java source, ASCII text*

```
import React from 'react';

interface NodeProps {
  role: string;
  name: string;
  bond: string;
  isRoot?: boolean;
}

const HierarchyNode = ({ role, name, bond, isRoot }: NodeProps) => (
  <div className={`relative p-3 rounded-lg border ${
    isRoot 
      ? 'bg-cyan-500/5 border-cyan-500/20' 
      : 'bg-zinc-900 border-zinc-800'
  } w-44 text-center`}>
    <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">{role}</div>
    <div className="text-sm text-white truncate">{name}</div>
    <div className="mt-2 text-xs font-mono text-zinc-400 bg-zinc-950 rounded px-2 py-1">
      Bond: ${bond}
    </div>
  </div>
);

export const AgentSwarmView = () => {
  return (
    <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-1 rounded-full bg-cyan-400" />
        <h3 className="text-sm font-medium text-white">Liability Tree</h3>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Root */}
        <HierarchyNode 
          role="Manager" 
          name="Portfolio Manager Alpha" 
          bond="50,000" 
          isRoot 
        />
        
        {/* Connector */}
        <div className="w-px h-4 bg-zinc-700" />
        
        {/* Children */}
        <div className="flex gap-6 relative">
          {/* Horizontal connector */}
          <div className="absolute -top-4 left-1/4 right-1/4 h-px bg-zinc-700" />
          <div className="absolute -top-4 left-1/4 w-px h-4 bg-zinc-700" />
          <div className="absolute -top-4 right-1/4 w-px h-4 bg-zinc-700" />
          
          <HierarchyNode role="Research" name="Sentiment Analyzer" bond="5,000" />
          <HierarchyNode role="Execution" name="Uniswap Executor" bond="12,000" />
        </div>
      </div>
      
      <p className="text-[11px] text-zinc-600 text-center mt-5">
        If worker faults, manager bond is slashed first
      </p>
    </div>
  );
};```

###### File: features/underwriting/Underwriting.tsx
###*Size: 16K, Lines: 429, Type: Java source, ASCII text*

```
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { AgentSwarmView } from './AgentHierarchy';
import { useNetwork } from '../../context/NetworkContext';
import { MOCK_AGENTS } from '../../core/constants';
import { 
  SkeletonCard, 
  SkeletonTable,
  SkeletonStat,
  FadeIn,
  Stagger
} from '../../shared/Skeleton';
import { Button, Spinner } from '../../shared/UIComponents';

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

// Stats data
const statsData = [
  { label: 'Total Value Locked', value: '$42.8M', highlight: false },
  { label: 'Avg Pool APY', value: '11.2%', highlight: true },
  { label: 'Total Agents', value: '12,403', highlight: false },
];

// Risk tier badge
const RiskBadge = ({ tier }: { tier: string }) => {
  const isCritical = tier.includes('Critical');
  const isBonded = tier.includes('Bonded');
  
  let style = 'bg-zinc-800 text-zinc-400';
  if (isCritical) style = 'bg-rose-500/10 text-rose-400';
  if (isBonded) style = 'bg-cyan-500/10 text-cyan-400';
  if (tier.includes('Speculative')) style = 'bg-amber-500/10 text-amber-400';

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${style}`}>
      {tier.replace(/\s*\([^)]*\)/, '')}
    </span>
  );
};

// Score bar
const ScoreBar = ({ score }: { score: number }) => (
  <div className="flex items-center gap-2">
    <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${score > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <span className={`text-xs font-mono ${score > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
      {score}
    </span>
  </div>
);

// Staking modal with loading states
const StakingModal = ({ agent, onClose }: { agent: any; onClose: () => void }) => {
  const { stakeOnAgent, getOptimisticBalance } = useNetwork();
  const [amount, setAmount] = useState('100');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  
  const optimisticBalance = getOptimisticBalance();
  const numAmount = Number(amount);
  const isValid = numAmount > 0 && numAmount <= optimisticBalance;
  
  const handleConfirm = async () => {
    if (!isValid) return;
    
    setStatus('pending');
    const success = await stakeOnAgent(agent.id, numAmount);
    
    if (success) {
      setStatus('success');
      // Close after showing success
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setStatus('error');
      // Allow retry
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <FadeIn>
        <div className={`w-full max-w-sm bg-zinc-900 border rounded-xl shadow-2xl transition-colors duration-300 ${
          status === 'pending' ? 'border-cyan-500/30' : 
          status === 'success' ? 'border-emerald-500/30' :
          status === 'error' ? 'border-rose-500/30' :
          'border-zinc-800'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h3 className="text-base font-medium text-white">
              {status === 'success' ? 'Stake Confirmed' : 'Stake on Agent'}
            </h3>
            {status === 'idle' && (
              <button onClick={onClose} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {status === 'success' ? (
              <div className="py-8 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Successfully Staked</p>
                  <p className="text-sm text-zinc-500 mt-1">{amount} IOI on {agent.name}</p>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5">Agent</label>
                  <div className="text-sm text-white">{agent.name}</div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-zinc-500">Amount (IOI)</label>
                    <span className="text-xs text-zinc-600">
                      Available: <span className="text-zinc-400 font-mono">{optimisticBalance.toLocaleString()}</span>
                    </span>
                  </div>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={status === 'pending'}
                    className={`w-full h-10 px-3 bg-zinc-950 border rounded-md text-white font-mono text-sm focus:outline-none transition-colors ${
                      !isValid && amount ? 'border-rose-500/50' : 'border-zinc-800 focus:border-zinc-700'
                    } disabled:opacity-50`}
                  />
                  {!isValid && numAmount > optimisticBalance && (
                    <p className="text-xs text-rose-400 mt-1">Insufficient balance</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-t border-zinc-800">
                  <span className="text-zinc-500">Expected APY</span>
                  <span className="text-emerald-400 font-mono">{agent.apy}%</span>
                </div>
                
                {status === 'pending' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                    <Spinner className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-cyan-400">Confirming transaction...</span>
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                    <span className="text-sm text-rose-400">Transaction failed. Please try again.</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {status !== 'success' && (
            <div className="flex gap-2 px-5 py-4 border-t border-zinc-800">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={status === 'pending'}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                loading={status === 'pending'}
                disabled={!isValid || status === 'pending'}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

// Skeleton components
const StatsSkeleton = () => (
  <div className="grid grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonCard key={i} className="p-4">
        <SkeletonStat />
      </SkeletonCard>
    ))}
  </div>
);

// Agent table row with optimistic UI
const AgentRow = ({ 
  agent, 
  isExpanded, 
  onToggle, 
  onStake, 
  isConnected, 
  onConnect,
  isPending,
  optimisticAgent
}: any) => {
  const displayAgent = optimisticAgent || agent;
  
  return (
    <React.Fragment>
      <tr 
        className={`cursor-pointer transition-colors ${
          isPending 
            ? 'bg-cyan-500/5' 
            : 'hover:bg-zinc-900/30'
        }`}
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-zinc-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-600" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">{agent.name}</span>
                {isPending && <Spinner className="w-3 h-3 text-cyan-400" />}
              </div>
              <div className="text-xs text-zinc-600 font-mono hidden sm:block">
                {agent.did.substring(0, 20)}...
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <RiskBadge tier={agent.riskTier} />
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <ScoreBar score={agent.securityScore} />
        </td>
        <td className="px-4 py-3 text-right">
          <span className="text-sm font-mono text-emerald-400">{agent.apy}%</span>
        </td>
        <td className="px-4 py-3 text-right hidden sm:table-cell">
          <span className={`text-sm font-mono ${isPending ? 'text-cyan-400' : 'text-zinc-400'}`}>
            {(displayAgent.totalStaked / 1000000).toFixed(1)}M
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          {isConnected ? (
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isPending 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-white text-zinc-900 hover:bg-zinc-200'
              }`}
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                if (!isPending) onStake();
              }}
            >
              {isPending ? 'Pending' : 'Stake'}
            </button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); onConnect(); }} 
              className="text-xs text-zinc-500 hover:text-white"
            >
              Connect
            </button>
          )}
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="bg-zinc-950">
          <td colSpan={6} className="px-4 py-4">
            <FadeIn>
              <AgentSwarmView />
            </FadeIn>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default function Underwriting() {
  const { 
    agents, 
    stakeOnAgent, 
    balance, 
    isConnected, 
    connectWallet,
    isStakePending,
    getOptimisticAgent,
    getOptimisticBalance
  } = useNetwork();
  
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [stakingTarget, setStakingTarget] = useState<string | null>(null);

  // Simulated loading
  const { data: statsLoaded, loading: statsLoading } = useSimulatedFetch(statsData, 400);
  const { data: agentsLoaded, loading: agentsLoading } = useSimulatedFetch(MOCK_AGENTS, 700);

  const optimisticBalance = getOptimisticBalance();

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium text-white">Underwriting</h1>
            <p className="text-sm text-zinc-500 mt-1">Stake IOI on agents to earn yield. You assume liability.</p>
          </div>
          {isConnected && (
            <div className="text-right">
              <div className="text-xs text-zinc-500">Available</div>
              <div className={`text-lg font-mono ${optimisticBalance !== balance ? 'text-cyan-400' : 'text-white'}`}>
                {optimisticBalance.toLocaleString()} IOI
                {optimisticBalance !== balance && (
                  <Spinner className="w-3 h-3 inline ml-2" />
                )}
              </div>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Stats */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <Stagger className="grid grid-cols-3 gap-4" staggerMs={60}>
          {statsLoaded!.map((stat, i) => (
            <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="text-xs text-zinc-500 mb-1">{stat.label}</div>
              <div className={`text-xl font-medium ${stat.highlight ? 'text-cyan-400' : 'text-white'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </Stagger>
      )}

      {/* Table */}
      {agentsLoading ? (
        <SkeletonTable rows={4} columns={6} />
      ) : (
        <FadeIn>
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wide px-4 py-3">Agent</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Risk</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Score</th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wide px-4 py-3">APY</th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Staked</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {agentsLoaded!.map((agent) => (
                  <AgentRow
                    key={agent.id}
                    agent={agent}
                    isExpanded={expandedAgent === agent.id}
                    onToggle={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    onStake={() => setStakingTarget(agent.id)}
                    isConnected={isConnected}
                    onConnect={connectWallet}
                    isPending={isStakePending(agent.id)}
                    optimisticAgent={getOptimisticAgent(agent.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      )}
      
      {/* Warning */}
      <FadeIn delay={400}>
        <p className="text-xs text-zinc-500 text-center">
          Staking involves risk. If an agent you underwrite is slashed, your stake will be forfeited.
        </p>
      </FadeIn>
      
      {stakingTarget && (
        <StakingModal 
          agent={agents.find(a => a.id === stakingTarget)} 
          onClose={() => setStakingTarget(null)} 
        />
      )}
    </div>
  );
}```

#### Directory: node_modules (skipped)

#### Directory: shared

##### Directory: shared/layout

###### File: shared/layout/CommandPalette.tsx
###*Size: 8.0K, Lines: 125, Type: Java source, Unicode text, UTF-8 text*

```
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
};```

###### File: shared/layout/Header.tsx
###*Size: 8.0K, Lines: 141, Type: Java source, Unicode text, UTF-8 text*

```
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
};```

###### File: shared/layout/Sidebar.tsx
###*Size: 8.0K, Lines: 135, Type: Java source, ASCII text*

```
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Vote, 
  ShieldCheck, 
  Scale, 
  ChevronLeft,
  ChevronRight,
  Circle
} from 'lucide-react';
import ioiLogo from '../../assets/ioi-logo-dark.svg';
import logoFinal from '../../assets/logo-final.svg';

const IOILogo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="flex items-center justify-center w-full">
    <img 
      src={collapsed ? logoFinal : ioiLogo} 
      alt="IOI Network" 
      className={collapsed ? "w-8 h-8" : "h-8 w-auto"} 
    />
  </div>
);

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Governance', icon: Vote, path: '/governance' },
  { name: 'Underwriting', icon: ShieldCheck, path: '/underwriting' },
  { name: 'Judiciary', icon: Scale, path: '/judiciary' },
];

export const Sidebar = ({ 
  mobileOpen, 
  setMobileOpen,
  collapsed,
  setCollapsed
}: { 
  mobileOpen: boolean; 
  setMobileOpen: (o: boolean) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}) => {
  const location = useLocation();
  const [blockHeight, setBlockHeight] = useState(12940221);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setBlockHeight(h => h + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-zinc-950 border-r border-zinc-800
        transform transition-all duration-200 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-16' : 'w-56'} 
        flex flex-col
      `}>
        
        {/* Collapse toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white rounded-full transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Logo */}
        <div className={`h-14 flex items-center border-b border-zinc-800 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
          <IOILogo collapsed={collapsed} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center h-9 rounded-md transition-colors relative group
                    ${collapsed ? 'justify-center px-0' : 'px-3'}
                    ${isActive 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}
                  `}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  
                  {!collapsed && (
                    <span className="ml-3 text-[13px] font-medium">{item.name}</span>
                  )}

                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 border border-zinc-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer status */}
        <div className={`border-t border-zinc-800 ${collapsed ? 'p-2' : 'p-3'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
            <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-zinc-500">Mainnet-Beta</div>
                <div className="text-[11px] font-mono text-zinc-400">#{blockHeight.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};```

###### File: shared/layout/StatusBar.tsx
###*Size: 4.0K, Lines: 56, Type: Java source, ASCII text*

```
import React, { useState, useEffect } from 'react';
import { Wifi, Activity, Zap, Server, GitCommit, Database } from 'lucide-react';

export const StatusBar = () => {
  // Telemetry Simulation (Moved from Header.tsx)
  const [blockHeight, setBlockHeight] = useState(12940221);
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setBlockHeight(h => h + 1);
      setLatency(Math.floor(Math.random() * (24 - 8) + 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-7 bg-ioi-navy border-t border-ioi-border z-[60] flex items-center justify-between px-3 text-[10px] font-mono text-gray-500 select-none bg-opacity-95 backdrop-blur">
      {/* Left: Connection Details */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 hover:text-ioi-cyan cursor-help transition-colors">
          <Server className="w-3 h-3" />
          <span className="hidden sm:inline">Mainnet-Beta</span>
          <span className="sm:hidden">Mainnet</span>
        </div>
        
        <div className={`flex items-center gap-1.5 ${latency < 20 ? 'text-green-400' : 'text-amber-400'}`}>
          <Wifi className="w-3 h-3" />
          <span>{latency}ms</span>
        </div>

        <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">Node: 0x8f...2a1</span>
        </div>
      </div>

      {/* Right: Network Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-ioi-amber" title="Gas Price">
           <Zap className="w-3 h-3" />
           <span>4 gwei</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-ioi-cyan">
           <GitCommit className="w-3 h-3" />
           <span>#{blockHeight.toLocaleString()}</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 text-ioi-muted">
           <Activity className="w-3 h-3" />
           <span>v2.4.0-rc1</span>
        </div>
      </div>
    </footer>
  );
};```

##### File: shared/Skeleton.tsx
##*Size: 8.0K, Lines: 194, Type: HTML document, ASCII text*

```
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
);```

##### File: shared/UIComponents.tsx
##*Size: 4.0K, Lines: 128, Type: Java source, ASCII text*

```
import React from 'react';

// Minimal loading spinner
export const Spinner = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg 
    className={`animate-spin ${className}`} 
    viewBox="0 0 24 24" 
    fill="none"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="3"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Button with loading state
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  children?: React.ReactNode;
};

export const Button = ({ 
  loading = false, 
  variant = 'primary', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = 'relative flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-white text-zinc-900 hover:bg-zinc-200',
    secondary: 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800',
    ghost: 'text-zinc-500 hover:text-white hover:bg-zinc-800',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <Spinner className="w-4 h-4 absolute" />
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// Success checkmark animation
export const SuccessCheck = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg 
    className={`text-emerald-400 ${className}`} 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path 
      className="animate-[checkDraw_0.3s_ease-out_forwards]"
      d="M20 6L9 17l-5-5"
      style={{
        strokeDasharray: 24,
        strokeDashoffset: 24,
        animation: 'checkDraw 0.3s ease-out forwards'
      }}
    />
  </svg>
);

// Inline status indicator
export const StatusDot = ({ 
  status 
}: { 
  status: 'idle' | 'pending' | 'success' | 'error' 
}) => {
  const colors = {
    idle: 'bg-zinc-600',
    pending: 'bg-amber-400 animate-pulse',
    success: 'bg-emerald-400',
    error: 'bg-rose-400',
  };

  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status]}`} />
  );
};

// Optimistic value display - shows pending state
export const OptimisticValue = ({ 
  value, 
  pendingValue, 
  isPending,
  className = ''
}: { 
  value: string | number;
  pendingValue?: string | number;
  isPending: boolean;
  className?: string;
}) => (
  <span className={`inline-flex items-center gap-1.5 ${className}`}>
    {isPending ? (
      <>
        <span className="opacity-50 line-through text-xs">{value}</span>
        <span className="text-cyan-400">{pendingValue}</span>
        <Spinner className="w-3 h-3 text-cyan-400" />
      </>
    ) : (
      <span>{value}</span>
    )}
  </span>
);```

#### File: App.tsx
#*Size: 4.0K, Lines: 54, Type: Java source, ASCII text*

```
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { NetworkProvider } from './context/NetworkContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { Sidebar } from './shared/layout/Sidebar';
import { Header } from './shared/layout/Header';

// Features
import Dashboard from './features/dashboard/Dashboard';
import Governance from './features/governance/Governance';
import Underwriting from './features/underwriting/Underwriting';
import Judiciary from './features/judiciary/Judiciary';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <NetworkProvider>
        <Router>
          <div className="min-h-screen bg-zinc-950 flex text-zinc-100">
            
            <Sidebar 
              mobileOpen={mobileOpen} 
              setMobileOpen={setMobileOpen} 
              collapsed={collapsed} 
              setCollapsed={setCollapsed}
            />
            
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
              collapsed ? 'lg:pl-16' : 'lg:pl-56'
            }`}>
              <Header onMenuClick={() => setMobileOpen(true)} />
              
              <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/governance" element={<Governance />} />
                    <Route path="/underwriting" element={<Underwriting />} />
                    <Route path="/judiciary" element={<Judiciary />} />
                  </Routes>
                </div>
              </main>
            </div>
            
          </div>
        </Router>
      </NetworkProvider>
    </ToastProvider>
  );
}```

#### File: index.html
#*Size: 4.0K, Lines: 135, Type: HTML document, ASCII text*

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IOI Network</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
            }
          }
        }
      }
    </script>
    <style>
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      body {
        background-color: #09090b;
        color: #fafafa;
      }
      
      /* Minimal scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #27272a;
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #3f3f46;
      }
      
      /* Animations */
      @keyframes fadeIn {
        0% { 
          opacity: 0; 
          transform: translateY(4px);
        }
        100% { 
          opacity: 1; 
          transform: translateY(0);
        }
      }
      
      @keyframes slideInFromRight {
        from { 
          transform: translateX(100%); 
          opacity: 0; 
        }
        to { 
          transform: translateX(0); 
          opacity: 1; 
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
        opacity: 0;
      }
      
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      .animate-in {
        animation-duration: 200ms;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        animation-fill-mode: forwards;
      }
      
      .fade-in {
        animation-name: fadeIn;
      }
      
      .slide-in-from-right-full {
        animation-name: slideInFromRight;
      }
    </style>
    <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.2.3",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "react/": "https://esm.sh/react@^19.2.3/",
    "react-router-dom": "https://esm.sh/react-router-dom@^7.12.0",
    "lucide-react": "https://esm.sh/lucide-react@^0.562.0",
    "recharts": "https://esm.sh/recharts@^3.6.0"
  }
}
    </script>
    <link rel="stylesheet" href="/index.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>```

#### File: index.tsx
#*Size: 4.0K, Lines: 14, Type: Java source, ASCII text*

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);```

#### File: metadata.json
#*Size: 4.0K, Lines: 3, Type: JSON data*

#*File content not included (exceeds threshold or non-text file)*

#### File: package.json
#*Size: 4.0K, Lines: 24, Type: JSON data*

#*File content not included (exceeds threshold or non-text file)*

#### File: package-lock.json
#*Size: 80K, Lines: 2281, Type: JSON data*

#*File content not included (exceeds threshold or non-text file)*

#### File: README.md
#*Size: 4.0K, Lines: 1, Type: ASCII text*

```markdown
# IOI Network: Governance Portal
```

#### File: tsconfig.json
#*Size: 4.0K, Lines: 28, Type: JSON data*

#*File content not included (exceeds threshold or non-text file)*

#### File: vite.config.ts
#*Size: 4.0K, Lines: 23, Type: Java source, ASCII text*

```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

