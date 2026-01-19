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
              {/* FIXED: Passing displayAgent as rootAgent to the child component */}
              <AgentSwarmView rootAgent={displayAgent} />
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
}