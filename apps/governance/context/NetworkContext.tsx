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
};