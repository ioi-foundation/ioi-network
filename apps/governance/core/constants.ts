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
];