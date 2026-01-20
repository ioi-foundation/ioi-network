import React, { useState, useEffect } from 'react';
import { Clock, Check, ChevronRight, ExternalLink } from 'lucide-react';
import { CURRENT_EPOCH, MOCK_PROPOSALS } from '../../core/constants';
import { Proposal } from '../../core/types';
import { useNetwork } from '../../context/NetworkContext';

// Refactored Imports from Shared UI Package
import { 
  SkeletonCard, 
  SkeletonProposalCard,
  SkeletonText,
  FadeIn,
  Stagger,
  Button, 
  Spinner 
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
}