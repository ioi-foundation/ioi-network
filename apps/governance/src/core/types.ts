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
}