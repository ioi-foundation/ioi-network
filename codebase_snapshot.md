# Codebase Snapshot: apps
Created: Tue Jan 20 12:40:08 AM EST 2026
Target: /home/levijosman/depin-network/codebase/ioi-network/apps
Line threshold for included files: 1800

## Summary Statistics

* Total files: 20802
* Total directories: 1101

### Directory: /home/levijosman/depin-network/codebase/ioi-network/apps

#### Directory: documentation

##### Directory: documentation/node_modules (skipped)

##### Directory: documentation/sources

###### Directory: documentation/sources/crates

####### Directory: documentation/sources/crates/consensus

######## Directory: documentation/sources/crates/consensus/src

######### File: documentation/sources/crates/consensus/src/admft.rs
######*Size: 4.0K, Lines: 53, Type: ASCII text*

```rust

// Copyright (c) 2024 IOI Network. All rights reserved.

use crate::guardian::{GuardianClient, GuardianSignature};
use crate::types::{Block, BlockHeight, ValidatorId};

/// The A-DMFT Consensus Engine.
pub struct AdmftConsensus {
    validator_id: ValidatorId,
    guardian: GuardianClient,
    state: ConsensusState,
}

impl AdmftConsensus {
    /// Proposes a new block anchored by the local Guardian.
    pub fn propose_block(&mut self, parent: &Block, txs: Vec<Transaction>) -> Result<Block, Error> {
        let height = parent.height + 1;
        
        // 1. Execute block to get new Trace Hash
        let (execution_root, trace_hash) = self.execute_and_trace(&txs);
        
        // 2. Request Monotonic Signature from Guardian
        // The Guardian enforces that `height` > `last_signed_height`
        let signature = self.guardian.sign_proposal(
            height,
            execution_root,
            trace_hash
        )?;

        Ok(Block {
            height,
            parent_hash: parent.hash(),
            transactions: txs,
            guardian_signature: signature,
            trace_hash,
        })
    }

    /// Verifies a block proposed by a peer.
    pub fn verify_block(&self, block: &Block) -> bool {
        // Verify the signature against the validator's known Guardian PubKey
        // The signature must include the monotonic counter to be valid.
        block.guardian_signature.verify(
            block.hash(),
            self.get_validator_key(block.proposer)
        )
    }

    fn execute_and_trace(&self, txs: &[Transaction]) -> (Hash, Hash) {
        // ...
        (Hash::default(), Hash::default())
    }
}
```

####### Directory: documentation/sources/crates/execution

######## Directory: documentation/sources/crates/execution/src

######### Directory: documentation/sources/crates/execution/src/app

########## File: documentation/sources/crates/execution/src/app/state_machine.rs
#######*Size: 4.0K, Lines: 70, Type: ASCII text*

```rust

// Copyright (c) 2024 IOI Network. All rights reserved.

use crate::mv_memory::{MvMemory, Version};
use crate::scheduler::{Scheduler, Task};
use crate::types::{Transaction, ExecutionResult};

/// The Block-STM Parallel Execution Engine.
pub struct BlockStmEngine {
    memory: MvMemory,
    scheduler: Scheduler,
    concurrency_level: usize,
}

impl BlockStmEngine {
    pub fn new(txs: Vec<Transaction>, concurrency_level: usize) -> Self {
        Self {
            memory: MvMemory::new(),
            scheduler: Scheduler::new(txs),
            concurrency_level,
        }
    }

    /// Executes a block of transactions in parallel using optimistic concurrency.
    pub fn execute_block(&mut self) -> Vec<ExecutionResult> {
        let pool = rayon::ThreadPoolBuilder::new()
            .num_threads(self.concurrency_level)
            .build()
            .unwrap();

        pool.scope(|s| {
            for _ in 0..self.concurrency_level {
                s.spawn(|_| self.worker_loop());
            }
        });

        self.memory.finalize_block()
    }

    fn worker_loop(&self) {
        while let Some(task) = self.scheduler.next_task() {
            match task {
                Task::Execute(tx_idx) => {
                    let tx = self.scheduler.get_tx(tx_idx);
                    // Optimistic execution against multi-version memory
                    let result = self.execute_transaction(tx, &self.memory);
                    
                    if self.memory.record_execution(tx_idx, result) {
                        // If validation passes, we might need to re-validate higher txs
                        self.scheduler.check_dependencies(tx_idx);
                    } else {
                        // Validation failed immediately
                        self.scheduler.mark_for_retry(tx_idx);
                    }
                }
                Task::Validate(tx_idx) => {
                    if !self.memory.validate_read_set(tx_idx) {
                        self.scheduler.mark_for_retry(tx_idx);
                    }
                }
            }
        }
    }

    fn execute_transaction(&self, tx: &Transaction, memory: &MvMemory) -> ExecutionResult {
        // VM Logic placeholder
        // ...
        ExecutionResult::default()
    }
}
```

####### Directory: documentation/sources/crates/scs

######## Directory: documentation/sources/crates/scs/src

######### File: documentation/sources/crates/scs/src/store.rs
######*Size: 4.0K, Lines: 58, Type: ASCII text*

```rust

// Copyright (c) 2024 IOI Network. All rights reserved.

use crate::index::MHnswIndex;
use crate::types::{Frame, FrameId, RetrievalProof, Query};
use rocksdb::DB;

/// The Sovereign Context Store.
/// Combines persistent Frame storage with a Verifiable Vector Index.
pub struct ScsStore {
    db: DB,
    vector_index: MHnswIndex,
}

impl ScsStore {
    pub fn open(path: &str) -> Self {
        // Initialize RocksDB and load the vector index
        Self {
            db: DB::open_default(path).unwrap(),
            vector_index: MHnswIndex::load(path),
        }
    }

    /// Appends a new immutable frame to the agent's context.
    pub fn append_frame(&mut self, frame: Frame) -> Result<FrameId, Error> {
        let frame_id = frame.calculate_id();
        
        // 1. Commit raw frame to disk
        self.db.put(frame_id.as_bytes(), bincode::serialize(&frame)?)?;
        
        // 2. Index frame embeddings in mHNSW
        for embedding in frame.embeddings() {
            self.vector_index.insert(embedding, frame_id)?;
        }
        
        Ok(frame_id)
    }

    /// Performs a verifiable vector search over the agent's memory.
    pub fn search(&self, query: Query) -> (Vec<Frame>, RetrievalProof) {
        // Perform Approximate Nearest Neighbor search
        let results = self.vector_index.search(query.vector, query.k);
        
        // Generate a Merkle proof attesting to the correctness of the search traversal
        let proof = self.vector_index.generate_proof(&results);
        
        let frames = results.iter()
            .map(|id| self.get_frame(id))
            .collect();

        (frames, proof)
    }

    fn get_frame(&self, id: &FrameId) -> Frame {
        // ...
        Frame::default()
    }
}
```

######### File: documentation/sources/crates/scs/src/types.rs
######*Size: 4.0K, Lines: 35, Type: ASCII text*

```rust

// Copyright (c) 2024 IOI Network. All rights reserved.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Frame {
    pub id: FrameId,
    pub timestamp: u64,
    pub observations: Vec<Perception>,
    pub thoughts: Vec<ReasoningChain>,
    pub actions: Vec<ActionDigest>,
    pub parent_hash: Hash,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FrameId(String);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetrievalProof {
    pub root: Hash,
    pub proof: Vec<Hash>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Query {
    pub vector: Vec<f32>,
    pub k: usize,
}

// Type aliases for demo purposes
pub type Perception = String;
pub type ReasoningChain = String;
pub type ActionDigest = String;
pub type Hash = String;
```

####### Directory: documentation/sources/crates/services

######## Directory: documentation/sources/crates/services/src

######### Directory: documentation/sources/crates/services/src/agentic

########## File: documentation/sources/crates/services/src/agentic/rules.rs
#######*Size: 4.0K, Lines: 82, Type: ASCII text*

```rust

// Copyright (c) 2024 IOI Network. All rights reserved.

use serde::{Deserialize, Serialize};
use crate::scs::SovereignContext;
use crate::types::{AgentId, ResourceId, SignatureHash};

/// The outcome of evaluating a firewall rule against an operation.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Verdict {
    /// Operation proceeds normally.
    Allow,

    /// Operation is blocked immediately.
    /// The violation is cryptographically committed to the audit log.
    Block(DenyReason),

    /// Operation is halted until an explicit approval is received.
    /// Triggers a 2FA request to the user's local device or Guardian.
    RequireApproval(ApprovalRequest),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionRules {
    pub id: String,
    pub conditions: Vec<RuleCondition>,
    pub verdict: Verdict,
    pub priority: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RuleCondition {
    /// Semantic target matching (e.g., "gui::click", "ucp::checkout")
    TargetMatch(ActionTarget),
    
    /// Matches specific agents or groups in the swarm DAG.
    AgentMatch(AgentPattern),
    
    /// Matches the resource being accessed (e.g. memory, network, IPC).
    ResourceMatch(ResourceId),
    
    /// Ensures the operation stays within gas limits.
    MaxComputeBudget(u64),
    
    /// Advanced: Checks if the call stack matches a verified topology.
    GraphTopologyVerify {
        required_depth: u8,
        root_signature: SignatureHash,
    }
}

pub struct FirewallEngine {
    policy_cache: LruCache<AgentId, Vec<ActionRules>>,
}

impl FirewallEngine {
    pub fn new() -> Self {
        Self {
            policy_cache: LruCache::new(1000),
        }
    }

    /// The core evaluation loop for the Agency Firewall.
    pub fn evaluate(&self, ctx: &SovereignContext, op: &Operation) -> Verdict {
        let rules = self.get_policy(ctx.agent_id);
        
        for rule in rules {
            if self.matches(rule, op) {
                // First-match wins logic for deterministic execution
                return rule.verdict.clone();
            }
        }
        
        // Zero Trust: Block if no rules match
        Verdict::Block(DenyReason::NoMatchingPolicy)
    }

    fn matches(&self, rule: &ActionRules, op: &Operation) -> bool {
        // Implementation of condition matching logic...
        true
    }
}
```

######### Directory: documentation/sources/crates/services/src/identity

########## File: documentation/sources/crates/services/src/identity/mod.rs
#######*Size: 4.0K, Lines: 66, Type: ASCII text*

```rust

// Copyright (c) 2024 IOI Network. All rights reserved.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SignatureSuite {
    Ed25519,
    MlDsa44, // Post-Quantum (Dilithium)
    Hybrid,  // Ed25519 + ML-DSA-44
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdentityRecord {
    pub agent_id: AgentId,
    pub current_key: PublicKey,
    pub suite: SignatureSuite,
    pub rotation_state: RotationState,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RotationState {
    Stable,
    InGracePeriod {
        new_key: PublicKey,
        rem_blocks: u32,
    },
}

pub struct IdentityHub {
    store: IdentityStore,
}

impl IdentityHub {
    pub fn initiate_rotation(&mut self, agent: AgentId, new_key: PublicKey, sig_old: Signature, sig_new: Signature) -> Result<(), Error> {
        let mut record = self.store.get(agent)?;
        
        // Validate proofs of ownership for both keys
        self.verify(record.current_key, &sig_old)?;
        self.verify(new_key, &sig_new)?;
        
        // Enter Grace Period
        record.rotation_state = RotationState::InGracePeriod {
            new_key,
            rem_blocks: 1000, // ~1 hour
        };
        
        self.store.update(agent, record);
        Ok(())
    }

    pub fn on_end_block(&mut self) {
        // Process active rotations
        for mut record in self.store.iter_mut() {
            if let RotationState::InGracePeriod { new_key, rem_blocks } = record.rotation_state {
                if rem_blocks == 0 {
                    // Finalize Rotation
                    record.current_key = new_key;
                    record.rotation_state = RotationState::Stable;
                } else {
                    record.rotation_state = RotationState::InGracePeriod { new_key, rem_blocks: rem_blocks - 1 };
                }
            }
        }
    }
}
```

##### Directory: documentation/src

###### Directory: documentation/src/components

####### Directory: documentation/src/components/ui

###### Directory: documentation/src/core

####### File: documentation/src/core/constants.tsx
####*Size: 8.0K, Lines: 143, Type: Java source, ASCII text*

```
// File: src/core/constants.tsx
import React from 'react';
import { 
  Code2, 
  Cpu, 
  Layers, 
  Terminal, 
  Shield, 
  Database, 
  Globe, 
  Fingerprint,
  Zap,
  Box,
  FileJson
} from 'lucide-react';
import { NavigationTab, SidebarSection, SourceConfig } from './types';

const src = (repo: 'kernel' | 'swarm' | 'ddk', path: string): SourceConfig => ({ repo, path });

export const SIDEBAR_DATA: Record<NavigationTab, SidebarSection> = {
  [NavigationTab.SWARM]: {
    id: 'frameworkSidebar',
    label: 'Swarm SDK',
    color: 'text-blue-400',
    icon: <Code2 className="w-4 h-4" />,
    items: [
      { id: 'sdk/overview', label: 'Overview', type: 'doc', source: src('swarm', 'src/ioi_swarm/__init__.py'), description: 'Entry point for the IOI Swarm SDK.' },
      { id: 'sdk/quickstart-python', label: 'Quickstart (Python)', type: 'doc', source: src('swarm', 'README.md'), description: 'Initial setup for Python agent builders.' },
      {
        id: 'core-primitives',
        label: 'Core Primitives',
        type: 'category',
        items: [
          { id: 'sdk/agents', label: 'Agents', type: 'doc', source: src('swarm', 'src/ioi_swarm/agent.py') },
          { id: 'sdk/tools', label: 'Tools', type: 'doc', source: src('swarm', 'src/ioi_swarm/tools.py') },
          { id: 'sdk/client', label: 'Client', type: 'doc', source: src('swarm', 'src/ioi_swarm/client.py') },
          { id: 'sdk/types', label: 'Types', type: 'doc', source: src('swarm', 'src/ioi_swarm/types.py') },
        ],
      },
      {
        id: 'ghost-mode',
        label: 'Ghost Mode',
        type: 'category',
        items: [
          { id: 'sdk/ghost/trace-recording', label: 'Trace Recording', type: 'doc', source: src('swarm', 'src/ioi_swarm/ghost.py') },
          { id: 'sdk/ghost/policy-synthesis', label: 'Policy Synthesis', type: 'doc', source: src('kernel', 'crates/cli/src/commands/policy.rs') },
        ],
      },
    ],
  },
  [NavigationTab.KERNEL]: {
    id: 'kernelSidebar',
    label: 'Kernel & Node',
    color: 'text-orange-400',
    icon: <Cpu className="w-4 h-4" />,
    items: [
      { id: 'kernel/architecture', label: 'Architecture', type: 'doc', source: src('kernel', 'crates/node/src/lib.rs'), description: 'The Triadic Model runtime specification.' },
      { id: 'kernel/installation', label: 'Installation', type: 'doc', source: src('kernel', 'Dockerfile'), description: 'Build instructions for node operators.' },
      {
        id: 'execution',
        label: 'Execution Engine',
        type: 'category',
        items: [
          { id: 'kernel/execution/parallel', label: 'Parallel (Block-STM)', type: 'doc', source: src('kernel', 'crates/execution/src/app/state_machine.rs') },
          { id: 'kernel/execution/scheduler', label: 'Scheduler', type: 'doc', source: src('kernel', 'crates/execution/src/scheduler.rs') },
        ]
      },
      {
        id: 'firewall',
        label: 'Agency Firewall',
        type: 'category',
        items: [
          { id: 'kernel/firewall/rules', label: 'Action Rules', type: 'doc', source: src('kernel', 'crates/services/src/agentic/rules.rs') },
          { id: 'kernel/firewall/scrubber', label: 'Scrubber', type: 'doc', source: src('kernel', 'crates/services/src/agentic/scrubber.rs') },
        ],
      },
      {
        id: 'scs',
        label: 'Sovereign Context (SCS)',
        type: 'category',
        items: [
          { id: 'kernel/storage/scs', label: 'Verifiable Store', type: 'doc', source: src('kernel', 'crates/scs/src/types.rs') },
          { id: 'kernel/scs/indexing', label: 'Vector Indexing (mHNSW)', type: 'doc', source: src('kernel', 'crates/scs/src/index.rs') },
        ],
      },
      {
        id: 'consensus',
        label: 'Consensus (A-DMFT)',
        type: 'category',
        items: [
          { id: 'kernel/consensus/admft', label: 'Guardian Specs', type: 'doc', source: src('kernel', 'crates/consensus/src/admft.rs') },
          { id: 'kernel/consensus/slashing', label: 'Slashing', type: 'doc', source: src('kernel', 'crates/consensus/src/common/penalty.rs') },
        ],
      },
      {
        id: 'identity',
        label: 'Identity & Security',
        type: 'category',
        items: [
          { id: 'kernel/identity/pqc', label: 'PQC Migration', type: 'doc', source: src('kernel', 'crates/services/src/identity/mod.rs') },
        ]
      }
    ],
  },
  [NavigationTab.DDK]: {
    id: 'ddkSidebar',
    label: 'Driver Kit',
    color: 'text-emerald-400',
    icon: <Layers className="w-4 h-4" />,
    items: [
      { id: 'ddk/overview', label: 'Overview', type: 'doc', source: src('ddk', 'src/lib.rs') },
      {
        id: 'drivers',
        label: 'Standard Drivers',
        type: 'category',
        items: [
          { id: 'ddk/drivers/browser', label: 'Browser', type: 'doc', source: src('ddk', 'src/browser.rs') },
          { id: 'ddk/drivers/gui', label: 'GUI Engine', type: 'doc', source: src('ddk', 'src/gui/mod.rs') },
          { id: 'ddk/drivers/os', label: 'OS Bridge', type: 'doc', source: src('ddk', 'src/os.rs') },
        ],
      },
      {
        id: 'ibc',
        label: 'IBC & Interop',
        type: 'category',
        items: [
          { id: 'ddk/ibc/light-clients', label: 'Light Clients', type: 'doc', source: src('kernel', 'crates/services/ibc/light_clients/') },
          { id: 'ddk/ibc/zk-relay', label: 'ZK Relay', type: 'doc', source: src('kernel', 'crates/api/src/ibc/zk.rs') },
        ],
      },
    ],
  },
  [NavigationTab.API]: {
    id: 'apiSidebar',
    label: 'API Reference',
    color: 'text-purple-400',
    icon: <Terminal className="w-4 h-4" />,
    items: [
      { id: 'api/blockchain-proto', label: 'Blockchain Proto', type: 'doc', source: src('kernel', 'crates/ipc/proto/blockchain.proto') },
      { id: 'api/control-proto', label: 'Control Proto', type: 'doc', source: src('kernel', 'crates/ipc/proto/control.proto') },
      { id: 'api/public-proto', label: 'Public Proto', type: 'doc', source: src('kernel', 'crates/ipc/proto/public.proto') },
    ],
  },
};```

####### File: documentation/src/core/network-config.tsx
####*Size: 4.0K, Lines: 62, Type: Java source, ASCII text*

```
import React from 'react';
import { BookOpen, Scale, ShieldCheck, LayoutGrid, Terminal } from 'lucide-react';

export type NetworkAppId = 'hub' | 'governance' | 'docs' | 'explorer' | 'studio';

export interface NetworkApp {
  id: NetworkAppId;
  name: string;
  url: string; // Production URL
  devUrl: string; // Localhost URL
  icon: React.ReactNode;
  description: string;
}

export const IOI_APPS: NetworkApp[] = [
  {
    id: 'hub',
    name: 'IOI Hub',
    url: 'https://app.ioi.network',
    devUrl: 'http://localhost:3000',
    icon: <LayoutGrid className="w-4 h-4" />,
    description: 'Dashboard & Wallet'
  },
  {
    id: 'governance',
    name: 'Governance',
    url: 'https://gov.ioi.network',
    devUrl: 'http://localhost:3001',
    icon: <Scale className="w-4 h-4" />,
    description: 'DAO & Proposals'
  },
  {
    id: 'docs',
    name: 'Documentation',
    url: 'https://docs.ioi.network',
    devUrl: 'http://localhost:3002',
    icon: <BookOpen className="w-4 h-4" />,
    description: 'Kernel & SDK Refs'
  },
  {
    id: 'explorer',
    name: 'Block Explorer',
    url: 'https://scan.ioi.network',
    devUrl: 'http://localhost:3003',
    icon: <Terminal className="w-4 h-4" />,
    description: 'Transaction Ledger'
  },
  {
    id: 'studio',
    name: 'Agent Studio',
    url: 'https://studio.ioi.network',
    devUrl: 'http://localhost:3004',
    icon: <ShieldCheck className="w-4 h-4" />,
    description: 'Underwriting & Deploy'
  }
];

// Helper to get correct URL based on environment
export const getAppUrl = (app: NetworkApp) => {
  // In a real build, you'd check process.env.NODE_ENV
  const isDev = window.location.hostname === 'localhost'; 
  return isDev ? app.devUrl : app.url;
};```

####### File: documentation/src/core/types.ts
####*Size: 4.0K, Lines: 30, Type: Java source, ASCII text*

```typescript
import React from 'react';

export enum NavigationTab {
  SWARM = 'frameworkSidebar',
  KERNEL = 'kernelSidebar',
  DDK = 'ddkSidebar',
  API = 'apiSidebar'
}

export interface SourceConfig {
  repo: 'kernel' | 'swarm' | 'ddk';
  path: string;
  branch?: string;
}

export interface DocItem {
  id: string;
  label: string;
  type: 'doc' | 'category';
  source?: SourceConfig;
  items?: DocItem[];
  description?: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  items: DocItem[];
}```

####### File: documentation/src/core/utils.tsx
####*Size: 4.0K, Lines: 46, Type: Java source, ASCII text*

```
import { DocItem } from './types';

export interface SyncResult {
  status: 'synced' | 'drift' | 'verifying' | 'unknown';
  missingSymbols: string[];
}

export const checkContentIntegrity = (doc: string, source: string): SyncResult => {
  if (!doc || !source) return { status: 'unknown', missingSymbols: [] };

  const rustBlocks: string[] = doc.match(/```rust([\s\S]*?)```/g) || [];
  const missing: string[] = [];
  
  rustBlocks.forEach(block => {
    const regex = /(?:enum|struct|fn)\s+(\w+)/g;
    let match;
    while ((match = regex.exec(block)) !== null) {
        const name = match[1];
        if (!source.includes(name)) {
            missing.push(name);
        }
    }
  });

  if (missing.length > 0) return { status: 'drift', missingSymbols: [...new Set(missing)] };
  if (rustBlocks.length > 0) return { status: 'synced', missingSymbols: [] };
  return { status: 'unknown', missingSymbols: [] };
};

export const flattenDocs = (items: DocItem[]): DocItem[] => {
  return items.reduce((acc, item) => {
    if (item.type === 'doc') acc.push(item);
    if (item.items) acc.push(...flattenDocs(item.items));
    return acc;
  }, [] as DocItem[]);
};

export const findNodePath = (items: DocItem[], id: string): DocItem[] | null => {
  for (const item of items) {
    if (item.id === id) return [item];
    if (item.items) {
      const childPath = findNodePath(item.items, id);
      if (childPath) return [item, ...childPath];
    }
  }
  return null;
};```

###### Directory: documentation/src/features

####### Directory: documentation/src/features/content

######## File: documentation/src/features/content/SourceStatus.tsx
#####*Size: 8.0K, Lines: 97, Type: Java source, ASCII text*

```
// File: src/features/content/SourceStatus.tsx
import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, FileCode, GitBranch, ChevronDown, RefreshCw } from 'lucide-react';

interface SourceStatusProps {
  status: 'synced' | 'drift' | 'verifying' | 'unknown';
  path: string;
  repo: string;
  missingSymbols?: string[];
  onViewSource?: () => void;
}

export const SourceStatus = ({ status, path, repo, missingSymbols = [], onViewSource }: SourceStatusProps) => {
  const [expanded, setExpanded] = useState(false);
  const isDrift = status === 'drift';
  
  return (
    <div className={`
      mb-10 rounded-lg border overflow-hidden transition-all duration-300
      ${isDrift ? 'border-rose-500/30 bg-rose-500/5' : 'border-zinc-800 bg-zinc-900/30'}
    `}>
      {/* Header */}
      <div className={`
        px-4 py-3 border-b flex items-center justify-between
        ${isDrift ? 'border-rose-500/20 bg-rose-500/10' : 'border-zinc-800 bg-zinc-900/50'}
      `}>
        <div className="flex items-center gap-2">
          <FileCode className={`w-4 h-4 ${isDrift ? 'text-rose-400' : 'text-zinc-400'}`} />
          <span className={`text-xs font-medium ${isDrift ? 'text-rose-200' : 'text-zinc-300'}`}>
            Source Mapping
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status === 'verifying' ? (
             <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase tracking-wide">
               <RefreshCw className="w-3 h-3 animate-spin" /> Verifying
             </span>
          ) : isDrift ? (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20 uppercase tracking-wide hover:bg-rose-500/30 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" /> Drift Detected
              <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono">
            <GitBranch className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-500">{repo}</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">{path}</span>
          </div>
          
          {onViewSource && (
            <button 
              onClick={onViewSource}
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors"
            >
              View Code
            </button>
          )}
        </div>

        {/* Drift Details - The HUD */}
        {isDrift && expanded && missingSymbols.length > 0 && (
          <div className="mt-4 pt-4 border-t border-rose-500/20 animate-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-rose-200 font-medium mb-1">Documentation Outdated</p>
                <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                  The following kernel definitions referenced in this documentation were not found in the source file.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSymbols.map(sym => (
                    <code key={sym} className="text-[10px] font-mono text-rose-300 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/50">
                      {sym}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};```

####### Directory: documentation/src/features/navigation

######## File: documentation/src/features/navigation/DocsSidebar.tsx
#####*Size: 4.0K, Lines: 90, Type: Java source, ASCII text*

```
import React, { useState } from 'react';
import { ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { DocItem, SidebarSection } from '../../core/types';
import { SyncResult } from '../../core/utils';

interface SidebarProps {
  section: SidebarSection;
  activeDocId: string;
  onSelect: (id: string) => void;
  syncStatuses: Record<string, SyncResult>; 
}

export const DocsSidebar = ({ section, activeDocId, onSelect, syncStatuses }: SidebarProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderItems = (items: DocItem[], depth = 0) => (
    <div className="space-y-0.5">
      {items.map(item => {
        const isActive = item.id === activeDocId;
        const hasChildren = item.items && item.items.length > 0;
        const status = syncStatuses[item.id]?.status;

        if (item.type === 'category') {
          return (
            <div key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors"
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
              >
                <div className="flex items-center gap-2">
                  {expanded.has(item.id) ? <FolderOpen className="w-3 h-3" /> : <Folder className="w-3 h-3" />}
                  {item.label}
                </div>
                {hasChildren && (
                  <ChevronDown className={`w-3 h-3 transition-transform ${expanded.has(item.id) ? 'rotate-0' : '-rotate-90'}`} />
                )}
              </button>
              {expanded.has(item.id) && item.items && (
                <div className="mt-1 mb-2 relative border-l border-zinc-800 ml-4">
                  {renderItems(item.items, depth + 1)}
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`
              w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-all relative group
              ${isActive 
                ? 'bg-zinc-800 text-white font-medium' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}
            `}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            <span>{item.label}</span>
            
            {/* Status indicators */}
            {status === 'drift' && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
              </span>
            )}
            {status === 'synced' && isActive && (
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="py-4">
      {renderItems(section.items)}
    </div>
  );
};```

######## File: documentation/src/features/navigation/TableOfContents.tsx
#####*Size: 4.0K, Lines: 89, Type: HTML document, ASCII text*

```
// File: src/features/navigation/TableOfContents.tsx
import React, { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents = ({ markdown }: { markdown: string }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // 1. Parse Headings from Markdown
  useEffect(() => {
    const lines = markdown.split('\n');
    const extracted: Heading[] = [];
    
    // Slugify helper
    const slugify = (text: string) => 
      text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    lines.forEach(line => {
      // Match # Heading, ## Heading, etc.
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        extracted.push({
          level: match[1].length,
          text: match[2],
          id: slugify(match[2]) // Note: Ensure ReactMarkdown is generating matching IDs
        });
      }
    });

    setHeadings(extracted);
  }, [markdown]);

  // 2. Scroll Spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0% -80% 0%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 pl-8 border-l border-zinc-800 fixed right-8 top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4">
        On this page
      </h5>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                setActiveId(heading.id);
              }}
              className={`
                block text-xs transition-colors truncate
                ${activeId === heading.id 
                  ? 'text-cyan-400 font-medium' 
                  : 'text-zinc-500 hover:text-zinc-300'}
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};```

####### Directory: documentation/src/features/sync

######## File: documentation/src/features/sync/SourceStatus.tsx
#####*Size: 4.0K, Lines: 60, Type: Java source, ASCII text*

```
import React from 'react';
import { CheckCircle2, AlertTriangle, FileCode, GitBranch, ArrowRight } from 'lucide-react';

export const SourceStatus = ({ status, path, repo }: { status: 'synced' | 'drift', path: string, repo: string }) => {
  const isDrift = status === 'drift';
  
  return (
    <div className={`
      mb-10 rounded-lg border overflow-hidden
      ${isDrift ? 'border-rose-500/30 bg-rose-500/5' : 'border-zinc-800 bg-zinc-900/30'}
    `}>
      <div className={`
        px-4 py-3 border-b flex items-center justify-between
        ${isDrift ? 'border-rose-500/20 bg-rose-500/10' : 'border-zinc-800 bg-zinc-900/50'}
      `}>
        <div className="flex items-center gap-2">
          <FileCode className={`w-4 h-4 ${isDrift ? 'text-rose-400' : 'text-zinc-400'}`} />
          <span className={`text-xs font-medium ${isDrift ? 'text-rose-200' : 'text-zinc-300'}`}>
            Source Mapping
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isDrift ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20 uppercase tracking-wide">
              <AlertTriangle className="w-3 h-3" /> Drift Detected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-xs font-mono mb-3">
          <GitBranch className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-zinc-500">{repo}</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">{path}</span>
        </div>

        {isDrift && (
          <div className="mt-3 p-3 rounded bg-zinc-950 border border-zinc-800">
            <p className="text-[11px] text-zinc-400 mb-2">
              The documentation references symbols that are missing in the latest kernel build:
            </p>
            <div className="flex gap-2">
              <code className="text-[10px] text-rose-300 bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-900/50">
                RotationState::InGracePeriod
              </code>
              <code className="text-[10px] text-rose-300 bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-900/50">
                IdentityHub::verify
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};```

###### Directory: documentation/src/layout

####### File: documentation/src/layout/DocsLayout.tsx
####*Size: 4.0K, Lines: 91, Type: Java source, Unicode text, UTF-8 text*

```
import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { NavigationTab } from '../core/types';
import { SIDEBAR_DATA } from '../core/constants';
import { NetworkHeader } from '../shared/NetworkHeader';

interface DocsLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  toc?: React.ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const DocsLayout = ({ children, sidebar, toc, activeTab, onTabChange }: DocsLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100 font-sans selection:bg-cyan-500/20">
      
      {/* 1. Global Network Bar */}
      <NetworkHeader currentAppId="docs" />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-200 lg:translate-x-0
          top-9 /* Pushed down by NetworkHeader */
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar Header - Logo removed, just context title */}
          <div className="h-14 flex items-center px-4 border-b border-zinc-800 justify-between">
            <span className="font-bold text-white tracking-tight">Docs Portal</span>
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">v2.4</span>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100vh-3.5rem-2.25rem)]">
            {sidebar}
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 lg:pl-72 flex flex-col min-h-[calc(100vh-2.25rem)]">
          
          {/* App Header (Tabs & Search) */}
          <header className="h-14 sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden text-zinc-400">
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Navigation Tabs (Kernel, Swarm, DDK, API) */}
              <div className="hidden md:flex items-center gap-1">
                {Object.entries(SIDEBAR_DATA).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => onTabChange(key as NavigationTab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      activeTab === key 
                        ? 'bg-zinc-800 text-white' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search docs...</span>
              <kbd className="ml-2 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
            </button>
          </header>

          <main className="flex-1 w-full flex">
            <div className="flex-1 min-w-0 p-8 lg:p-12 xl:pr-8">
              {children}
            </div>
            
            {toc && (
              <div className="hidden xl:block w-72 shrink-0">
                {toc}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};```

###### Directory: documentation/src/shared

####### File: documentation/src/shared/DocsLayout.tsx
####*Size: 4.0K, Lines: 79, Type: Java source, Unicode text, UTF-8 text*

```
import React, { useState } from 'react';
import { BookOpen, Cpu, Layers, Terminal, ChevronRight, Search, Menu, Command } from 'lucide-react';

const NavSection = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{label}</h3>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const NavItem = ({ active, label, onClick, status }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-all ${
      active 
        ? 'bg-zinc-800 text-white font-medium' 
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
    }`}
  >
    <span>{label}</span>
    {status === 'drift' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
  </button>
);

export const DocsLayout = ({ children, sidebarContent }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-200 lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-14 flex items-center px-4 border-b border-zinc-800">
          <span className="font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center">
              <Terminal className="w-3 h-3 text-white" />
            </div>
            IOI Docs
          </span>
          <span className="ml-2 text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">v2.4</span>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-3.5rem)]">
          {sidebarContent}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-14 sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-zinc-400">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center text-xs text-zinc-500">
              <span>IOI Network</span>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-zinc-300">Kernel Core</span>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-cyan-400">Architecture</span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span>Search docs...</span>
            <kbd className="ml-2 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
          </button>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};```

####### File: documentation/src/shared/NetworkHeader.tsx
####*Size: 4.0K, Lines: 72, Type: HTML document, ASCII text, with very long lines (783)*

```
import React from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { IOI_APPS, getAppUrl, NetworkAppId } from '../core/network-config';

interface NetworkHeaderProps {
  currentAppId: NetworkAppId;
}

export const NetworkHeader = ({ currentAppId }: NetworkHeaderProps) => {
  return (
    <nav className="h-9 bg-black border-b border-zinc-800 flex items-center justify-between px-4 z-[60] relative">
      {/* Left: Network Logo & App Switcher */}
      <div className="flex items-center gap-6">
        {/* Master Brand */}
        <a href={getAppUrl(IOI_APPS[0])} className="flex items-center gap-2 group">
          <div className="w-4 h-4 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-sm" />
          <span className="text-xs font-bold text-zinc-300 tracking-tight group-hover:text-white transition-colors">
            IOI NETWORK
          </span>
        </a>

        {/* Divider */}
        <div className="h-3 w-px bg-zinc-800" />

        {/* App Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {IOI_APPS.map((app) => {
            const isActive = app.id === currentAppId;
            return (
              <a
                key={app.id}
                href={getAppUrl(app)}
                className={`
                  flex items-center gap-2 px-3 py-1 rounded text-[11px] font-medium transition-all
                  ${isActive 
                    ? 'text-white bg-zinc-900 shadow-sm ring-1 ring-zinc-800' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}
                `}
              >
                <span className={isActive ? 'text-cyan-400' : 'opacity-70'}>
                  {app.icon}
                </span>
                {app.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* Right: Global Utilities (Status, etc) */}
      <div className="flex items-center gap-4">
        {/* Mobile App Switcher Trigger would go here */}
        
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mainnet: <span className="text-zinc-300">Operational</span></span>
        </div>

        <a 
          href="https://github.com/ioi-network" 
          target="_blank" 
          rel="noreferrer"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <span className="sr-only">GitHub</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </nav>
  );
};```

###### File: documentation/src/App.tsx
###*Size: 12K, Lines: 245, Type: Java source, ASCII text*

```
// File: src/App.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check, Terminal } from 'lucide-react';
import { SIDEBAR_DATA } from './core/constants';
import { checkContentIntegrity, flattenDocs, SyncResult } from './core/utils';
import { DocsLayout } from './layout/DocsLayout';
import { DocsSidebar } from './features/navigation/DocsSidebar';
import { SourceStatus } from './features/content/SourceStatus';
import { TableOfContents } from './features/navigation/TableOfContents';
import { NavigationTab, DocItem } from './core/types';

// Map repo keys to local directory paths if serving locally
const LOCAL_REPO_MAP: Record<string, string> = {
  kernel: 'sources',
  swarm: 'sources', // Assuming swarm sdk is also under sources/ for this demo
  ddk: 'sources'
};

const CodeBlock = ({ node, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  const onCopy = () => {
    if (ref.current) {
      navigator.clipboard.writeText(ref.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950/50">
      <div className="absolute top-0 right-0 p-2 flex items-center gap-2">
        <span className="text-[10px] text-zinc-600 font-mono uppercase">
          {className?.replace('language-', '') || 'text'}
        </span>
        <button 
          onClick={onCopy}
          className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre ref={ref} className={`${className} !my-0 !bg-transparent !p-4 overflow-x-auto`} {...props}>
        {children}
      </pre>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.KERNEL);
  const [activeDocId, setActiveDocId] = useState<string>('kernel/consensus/admft');
  
  // Content State
  const [markdown, setMarkdown] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatuses, setSyncStatuses] = useState<Record<string, SyncResult>>({});

  const currentSection = SIDEBAR_DATA[activeTab];
  const flatDocs = useMemo(() => flattenDocs(currentSection.items), [currentSection]);
  
  // Find active doc or fallback to first
  const activeDoc = useMemo(() => 
    flatDocs.find(d => d.id === activeDocId) || flatDocs[0], 
  [flatDocs, activeDocId]);

  // 1. Load Content (Real Fetch)
  useEffect(() => {
    const fetchContent = async () => {
      if (!activeDoc) return;
      setIsLoading(true);
      setMarkdown(''); 
      
      try {
        // Fetch Markdown
        const docRes = await fetch(`/docs/${activeDoc.id}.md`);
        let docText = '';
        
        if (docRes.ok) {
          docText = await docRes.text();
          setMarkdown(docText);
        } else {
          setMarkdown(`# ${activeDoc.label}\n\n*Documentation file not found: /docs/${activeDoc.id}.md*`);
        }

        // Fetch Source Code (if mapped)
        let srcText = '';
        if (activeDoc.source) {
          // Try local sources folder first
          const localPath = `/${LOCAL_REPO_MAP[activeDoc.source.repo]}/${activeDoc.source.path}`;
          try {
            const srcRes = await fetch(localPath);
            if (srcRes.ok) {
              srcText = await srcRes.text();
              setSourceCode(srcText);
            }
          } catch (e) {
            console.warn("Failed to fetch local source:", e);
          }
        } else {
          setSourceCode('');
        }

        // Calculate Drift
        if (docText && srcText) {
          const status = checkContentIntegrity(docText, srcText);
          setSyncStatuses(prev => ({ ...prev, [activeDoc.id]: status }));
        } else if (activeDoc.source) {
          // Source config exists but file failed to load
          setSyncStatuses(prev => ({ 
            ...prev, 
            [activeDoc.id]: { status: 'unknown', missingSymbols: [] } 
          }));
        }

      } catch (e) {
        console.error("Content loading failed", e);
        setMarkdown("# Error\nFailed to load documentation content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [activeDocId, activeDoc]);

  // 2. Background Drift Check (for Sidebar badges)
  useEffect(() => {
    const checkAllDocs = async () => {
      const updates: Record<string, SyncResult> = {};
      
      // Limit to current section to save bandwidth
      const docsToCheck = flatDocs.filter(d => d.source && d.id !== activeDocId);
      
      for (const doc of docsToCheck) {
        if (!doc.source) continue;
        try {
          const [mdRes, srcRes] = await Promise.all([
            fetch(`/docs/${doc.id}.md`),
            fetch(`/${LOCAL_REPO_MAP[doc.source.repo]}/${doc.source.path}`)
          ]);
          
          if (mdRes.ok && srcRes.ok) {
            const md = await mdRes.text();
            const src = await srcRes.text();
            updates[doc.id] = checkContentIntegrity(md, src);
          }
        } catch (e) { /* ignore background errors */ }
      }
      setSyncStatuses(prev => ({ ...prev, ...updates }));
    };
    
    // Slight delay to prioritize main content
    const timer = setTimeout(checkAllDocs, 1000);
    return () => clearTimeout(timer);
  }, [activeTab]); // Re-run when switching tabs

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    const firstDoc = flattenDocs(SIDEBAR_DATA[tab].items)[0];
    if (firstDoc) setActiveDocId(firstDoc.id);
  };

  return (
    <DocsLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      sidebar={
        <DocsSidebar 
          section={currentSection} 
          activeDocId={activeDocId} 
          onSelect={setActiveDocId}
          syncStatuses={syncStatuses}
        />
      }
      toc={
        <TableOfContents markdown={markdown} />
      }
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8 font-mono">
          <span className="hover:text-zinc-300 transition-colors cursor-pointer">IOI</span>
          <span>/</span>
          <span className="text-zinc-300">{currentSection.label}</span>
          <span>/</span>
          <span className="text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">
            {activeDoc?.label}
          </span>
        </div>

        {/* Source Integrity Monitor */}
        {activeDoc?.source && (
          <SourceStatus 
            status={syncStatuses[activeDoc.id]?.status || 'verifying'}
            missingSymbols={syncStatuses[activeDoc.id]?.missingSymbols}
            repo={activeDoc.source.repo}
            path={activeDoc.source.path}
          />
        )}

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-10 bg-zinc-900 rounded-lg w-1/2 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-zinc-900/50 rounded w-full animate-pulse" />
              <div className="h-4 bg-zinc-900/50 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-zinc-900/50 rounded w-4/6 animate-pulse" />
            </div>
            <div className="h-48 bg-zinc-900/30 rounded-lg border border-zinc-800 animate-pulse" />
          </div>
        ) : (
          <article className="prose prose-invert max-w-none 
            prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-zinc-100
            prose-p:text-zinc-400 prose-p:leading-7
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-zinc-200 prose-strong:font-semibold
            prose-code:text-cyan-300 prose-code:font-normal prose-code:bg-cyan-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-hr:border-zinc-800
            prose-ul:my-6 prose-li:my-2
            prose-th:text-left prose-th:text-zinc-300 prose-td:text-zinc-400 prose-tr:border-zinc-800
            prose-blockquote:border-l-cyan-500 prose-blockquote:bg-zinc-900/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-zinc-400
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: CodeBlock,
                h1: ({node, ...props}) => <h1 className="text-3xl mb-8" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl mt-10 mb-4 pb-2 border-b border-zinc-800" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg mt-8 mb-3 text-zinc-200" {...props} />,
              }}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </DocsLayout>
  );
}```

##### File: documentation/constants.tsx
##*Size: 8.0K, Lines: 186, Type: Java source, ASCII text*

```

import React from 'react';
import { 
  Box, 
  Cpu, 
  Layers, 
  Terminal, 
  Shield, 
  Activity, 
  Share2, 
  Code2, 
  BookOpen,
  FileJson,
  Database,
  Globe,
  Fingerprint,
  Zap
} from 'lucide-react';
import { SidebarSection, NavigationTab, SourceConfig } from './types';

// Helper to construct source config
const src = (repo: 'kernel' | 'swarm' | 'ddk', path: string): SourceConfig => ({ repo, path });

export const SIDEBAR_DATA: Record<NavigationTab, SidebarSection> = {
  [NavigationTab.SWARM]: {
    id: 'frameworkSidebar',
    label: 'Swarm SDK',
    color: 'text-blue-400',
    icon: <Code2 className="w-5 h-5" />,
    items: [
      { id: 'sdk/overview', label: 'Overview', type: 'doc', source: src('swarm', 'src/ioi_swarm/__init__.py'), description: 'Entry point for the IOI Swarm SDK.' },
      { id: 'sdk/quickstart-python', label: 'Quickstart (Python)', type: 'doc', source: src('swarm', 'README.md'), description: 'Initial setup for Python agent builders.' },
      {
        id: 'core-primitives',
        label: 'Core Primitives',
        type: 'category',
        items: [
          { id: 'sdk/agents', label: 'Agents', type: 'doc', source: src('swarm', 'src/ioi_swarm/agent.py') },
          { id: 'sdk/tools', label: 'Tools', type: 'doc', source: src('swarm', 'src/ioi_swarm/tools.py') },
          { id: 'sdk/client', label: 'Client', type: 'doc', source: src('swarm', 'src/ioi_swarm/client.py') },
          { id: 'sdk/types', label: 'Types', type: 'doc', source: src('swarm', 'src/ioi_swarm/types.py') },
        ],
      },
      {
        id: 'ghost-mode',
        label: 'Ghost Mode',
        type: 'category',
        items: [
          { id: 'sdk/ghost/trace-recording', label: 'Trace Recording', type: 'doc', source: src('swarm', 'src/ioi_swarm/ghost.py') },
          { id: 'sdk/ghost/policy-synthesis', label: 'Policy Synthesis', type: 'doc', source: src('kernel', 'crates/cli/src/commands/policy.rs') },
        ],
      },
    ],
  },
  [NavigationTab.KERNEL]: {
    id: 'kernelSidebar',
    label: 'Kernel & Node',
    color: 'text-orange-400',
    icon: <Cpu className="w-5 h-5" />,
    items: [
      { id: 'kernel/architecture', label: 'Architecture', type: 'doc', source: src('kernel', 'crates/node/src/lib.rs'), description: 'The Triadic Model runtime specification.' },
      { id: 'kernel/installation', label: 'Installation', type: 'doc', source: src('kernel', 'Dockerfile'), description: 'Build instructions for node operators.' },
      {
        id: 'execution',
        label: 'Execution Engine',
        type: 'category',
        items: [
          { id: 'kernel/execution/parallel', label: 'Parallel (Block-STM)', type: 'doc', source: src('kernel', 'crates/execution/src/app/state_machine.rs') },
          { id: 'kernel/execution/scheduler', label: 'Scheduler', type: 'doc', source: src('kernel', 'crates/execution/src/scheduler.rs') },
        ]
      },
      {
        id: 'firewall',
        label: 'Agency Firewall',
        type: 'category',
        items: [
          { id: 'kernel/firewall/rules', label: 'Action Rules', type: 'doc', source: src('kernel', 'crates/services/src/agentic/rules.rs') },
          { id: 'kernel/firewall/scrubber', label: 'Scrubber', type: 'doc', source: src('kernel', 'crates/services/src/agentic/scrubber.rs') },
        ],
      },
      {
        id: 'scs',
        label: 'Sovereign Context (SCS)',
        type: 'category',
        items: [
          { id: 'kernel/storage/scs', label: 'Verifiable Store', type: 'doc', source: src('kernel', 'crates/scs/src/types.rs') },
          { id: 'kernel/scs/indexing', label: 'Vector Indexing (mHNSW)', type: 'doc', source: src('kernel', 'crates/scs/src/index.rs') },
        ],
      },
      {
        id: 'consensus',
        label: 'Consensus (A-DMFT)',
        type: 'category',
        items: [
          { id: 'kernel/consensus/admft', label: 'Guardian Specs', type: 'doc', source: src('kernel', 'crates/consensus/src/admft.rs') },
          { id: 'kernel/consensus/slashing', label: 'Slashing', type: 'doc', source: src('kernel', 'crates/consensus/src/common/penalty.rs') },
        ],
      },
      {
        id: 'identity',
        label: 'Identity & Security',
        type: 'category',
        items: [
          { id: 'kernel/identity/pqc', label: 'PQC Migration', type: 'doc', source: src('kernel', 'crates/services/src/identity/mod.rs') },
        ]
      }
    ],
  },
  [NavigationTab.DDK]: {
    id: 'ddkSidebar',
    label: 'Driver Kit',
    color: 'text-emerald-400',
    icon: <Layers className="w-5 h-5" />,
    items: [
      { id: 'ddk/overview', label: 'Overview', type: 'doc', source: src('ddk', 'src/lib.rs') },
      {
        id: 'drivers',
        label: 'Standard Drivers',
        type: 'category',
        items: [
          { id: 'ddk/drivers/browser', label: 'Browser', type: 'doc', source: src('ddk', 'src/browser.rs') },
          { id: 'ddk/drivers/gui', label: 'GUI Engine', type: 'doc', source: src('ddk', 'src/gui/mod.rs') },
          { id: 'ddk/drivers/os', label: 'OS Bridge', type: 'doc', source: src('ddk', 'src/os.rs') },
        ],
      },
      {
        id: 'ibc',
        label: 'IBC & Interop',
        type: 'category',
        items: [
          { id: 'ddk/ibc/light-clients', label: 'Light Clients', type: 'doc', source: src('kernel', 'crates/services/ibc/light_clients/') },
          { id: 'ddk/ibc/zk-relay', label: 'ZK Relay', type: 'doc', source: src('kernel', 'crates/api/src/ibc/zk.rs') },
        ],
      },
    ],
  },
  [NavigationTab.API]: {
    id: 'apiSidebar',
    label: 'API Reference',
    color: 'text-purple-400',
    icon: <Terminal className="w-5 h-5" />,
    items: [
      { id: 'api/blockchain-proto', label: 'Blockchain Proto', type: 'doc', source: src('kernel', 'crates/ipc/proto/blockchain.proto') },
      { id: 'api/control-proto', label: 'Control Proto', type: 'doc', source: src('kernel', 'crates/ipc/proto/control.proto') },
      { id: 'api/public-proto', label: 'Public Proto', type: 'doc', source: src('kernel', 'crates/ipc/proto/public.proto') },
    ],
  },
};

export const MAPPING_CARDS = [
  {
    title: "Parallel Engine",
    concept: "Block-STM",
    path: "crates/execution/src/app/",
    icon: <Zap className="text-yellow-400" />,
    color: "yellow"
  },
  {
    title: "Agency Firewall",
    concept: "Policy Engine",
    path: "crates/services/src/agentic/",
    icon: <Shield className="text-red-400" />,
    color: "red"
  },
  {
    title: "Sovereign Context",
    concept: "Verifiable SCS",
    path: "crates/scs/src/store.rs",
    icon: <Database className="text-emerald-400" />,
    color: "emerald"
  },
  {
    title: "Guardian Consensus",
    concept: "A-DMFT",
    path: "crates/consensus/src/admft.rs",
    icon: <Globe className="text-indigo-400" />,
    color: "indigo"
  },
  {
    title: "Identity Hub",
    concept: "PQC / Rotation",
    path: "crates/services/src/identity/",
    icon: <Fingerprint className="text-pink-400" />,
    color: "pink"
  }
];
```

##### File: documentation/index.html
##*Size: 4.0K, Lines: 64, Type: HTML document, ASCII text*

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IOI Network Docs Explorer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #030712;
            color: #f9fafb;
        }
        .mono {
            font-family: 'JetBrains Mono', monospace;
        }
        .glass {
            background: rgba(17, 24, 39, 0.7);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(75, 85, 99, 0.3);
        }
        /* Markdown Customization */
        .prose pre {
            background-color: #0d1117 !important;
            border: 1px solid #30363d;
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #111827;
        }
        ::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #4b5563;
        }
    </style>
<script type="importmap">
{
  "imports": {
    "react/": "https://esm.sh/react@^19.2.3/",
    "react": "https://esm.sh/react@^19.2.3",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "lucide-react": "https://esm.sh/lucide-react@^0.562.0",
    "react-markdown": "https://esm.sh/react-markdown@9.0.1?bundle",
    "rehype-highlight": "https://esm.sh/rehype-highlight@7.0.0?bundle",
    "remark-gfm": "https://esm.sh/remark-gfm@4.0.0?bundle",
    "rehype-raw": "https://esm.sh/rehype-raw@7.0.0?bundle"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
<body>
    <div id="root"></div>
<script type="module" src="/index.tsx"></script>
</body>
</html>
```

##### File: documentation/index.tsx
##*Size: 4.0K, Lines: 16, Type: Java source, ASCII text*

```

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

##### File: documentation/metadata.json
##*Size: 4.0K, Lines: 4, Type: JSON data*

##*File content not included (exceeds threshold or non-text file)*

##### File: documentation/package.json
##*Size: 4.0K, Lines: 28, Type: JSON data*

##*File content not included (exceeds threshold or non-text file)*

##### File: documentation/package-lock.json
##*Size: 128K, Lines: 3572, Type: JSON data*

##*File content not included (exceeds threshold or non-text file)*

##### File: documentation/README.md
##*Size: 4.0K, Lines: 20, Type: ASCII text*

```markdown
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HW3xGCi4JQmFRm9fFhMClDuuSNvKddzY

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
```

##### File: documentation/tsconfig.json
##*Size: 4.0K, Lines: 28, Type: JSON data*

##*File content not included (exceeds threshold or non-text file)*

##### File: documentation/types.ts
##*Size: 4.0K, Lines: 33, Type: Java source, ASCII text*

```typescript

// Import React to ensure the React namespace is available for type definitions
import React from 'react';

export interface SourceConfig {
  repo: 'kernel' | 'swarm' | 'ddk';
  path: string;
  branch?: string;
}

export interface DocItem {
  id: string;
  label: string;
  source?: SourceConfig;
  type: 'doc' | 'category';
  items?: DocItem[];
  description?: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  items: DocItem[];
  icon: React.ReactNode;
  color: string;
}

export enum NavigationTab {
  SWARM = 'frameworkSidebar',
  KERNEL = 'kernelSidebar',
  DDK = 'ddkSidebar',
  API = 'apiSidebar'
}
```

##### File: documentation/vite.config.ts
##*Size: 4.0K, Lines: 23, Type: Java source, ASCII text*

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

#### Directory: governance

##### Directory: governance/assets

###### File: governance/assets/ioi-logo-dark.svg
###*Size: 8.0K, Lines: 73, Type: SVG Scalable Vector Graphics image*

###*File content not included (exceeds threshold or non-text file)*

###### File: governance/assets/logo-final.svg
###*Size: 8.0K, Lines: 123, Type: SVG Scalable Vector Graphics image*

###*File content not included (exceeds threshold or non-text file)*

##### Directory: governance/context

###### File: governance/context/NetworkContext.tsx
###*Size: 8.0K, Lines: 258, Type: Java source, ASCII text*

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

###### File: governance/context/ToastContext.tsx
###*Size: 4.0K, Lines: 83, Type: Java source, ASCII text*

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

##### Directory: governance/core

###### File: governance/core/constants.ts
###*Size: 4.0K, Lines: 108, Type: Java source, ASCII text*

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

###### File: governance/core/network-config.tsx
###*Size: 4.0K, Lines: 75, Type: Java source, ASCII text*

```
import React from 'react';
import { LayoutGrid, Scale, BookOpen, Terminal, ShieldCheck, Globe } from 'lucide-react';

export type NetworkAppId = 'hub' | 'governance' | 'docs' | 'explorer' | 'studio' | 'www';

export interface NetworkApp {
  id: NetworkAppId;
  name: string;
  url: string;
  devUrl: string;
  icon: React.ElementType;
  description: string;
  status: 'live' | 'beta' | 'maintenance';
}

export const IOI_APPS: NetworkApp[] = [
  {
    id: 'www',
    name: 'Gateway',
    url: 'https://ioi.network',
    devUrl: 'http://localhost:3005',
    icon: Globe,
    description: 'Network Entry Point',
    status: 'live'
  },
  {
    id: 'hub',
    name: 'IOI Hub',
    url: 'https://app.ioi.network',
    devUrl: 'http://localhost:3000',
    icon: LayoutGrid,
    description: 'Dashboard & Wallet',
    status: 'beta'
  },
  {
    id: 'governance',
    name: 'Governance',
    url: 'https://gov.ioi.network',
    devUrl: 'http://localhost:3001',
    icon: Scale,
    description: 'DAO & Proposals',
    status: 'live'
  },
  {
    id: 'docs',
    name: 'Documentation',
    url: 'https://docs.ioi.network',
    devUrl: 'http://localhost:3002',
    icon: BookOpen,
    description: 'Kernel & SDK Refs',
    status: 'live'
  },
  {
    id: 'explorer',
    name: 'Block Explorer',
    url: 'https://scan.ioi.network',
    devUrl: 'http://localhost:3003',
    icon: Terminal,
    description: 'Transaction Ledger',
    status: 'live'
  },
  {
    id: 'studio',
    name: 'Agent Studio',
    url: 'https://studio.ioi.network',
    devUrl: 'http://localhost:3004',
    icon: ShieldCheck,
    description: 'Underwriting & Deploy',
    status: 'maintenance'
  }
];

export const getAppUrl = (app: NetworkApp) => {
  const isDev = window.location.hostname === 'localhost';
  return isDev ? app.devUrl : app.url;
};```

###### File: governance/core/types.ts
###*Size: 4.0K, Lines: 76, Type: ASCII text*

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

##### Directory: governance/features

###### Directory: governance/features/dashboard

####### File: governance/features/dashboard/Dashboard.tsx
####*Size: 12K, Lines: 315, Type: Java source, ASCII text*

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

###### Directory: governance/features/governance

####### File: governance/features/governance/Governance.tsx
####*Size: 12K, Lines: 318, Type: Java source, Unicode text, UTF-8 text*

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

###### Directory: governance/features/judiciary

####### File: governance/features/judiciary/DialecticView.tsx
####*Size: 8.0K, Lines: 133, Type: Java source, Unicode text, UTF-8 text*

```
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Scale } from 'lucide-react';

interface Argument {
  step: number;
  role: 'Prosecutor' | 'Defender' | 'Judge';
  claim: string;
  citations: { id: string; type: 'receipt' | 'policy' | 'oracle' }[];
  confidence: number; // 0.0 to 1.0
  technical_context?: string;
}

// Data mirroring Whitepaper §10.1.1
const MOCK_DEBATE: Argument[] = [
  {
    step: 1,
    role: 'Prosecutor',
    claim: "Agent violated Hard Constraint: receipt.latency (850ms) > ICS.deadline (500ms).",
    citations: [
      { id: "rcpt_0x8a...99", type: "receipt" },
      { id: "ics_template_v1", type: "policy" }
    ],
    confidence: 0.99,
    technical_context: "Integer math verification of timestamp delta."
  },
  {
    step: 2,
    role: 'Defender',
    claim: "Latency spike attributed to Network Oracle divergence. Provider executed within bounds relative to local clock.",
    citations: [
      { id: "oracle_chk_0x4...a2", type: "oracle" }
    ],
    confidence: 0.65,
    technical_context: "Requesting 'Force Majeure' exception per Protocol Rule 12.B."
  },
  {
    step: 3,
    role: 'Judge',
    claim: "Oracle divergence claim rejected. Local clock drift exceeds protocol tolerance (200ms). Slash verified.",
    citations: [],
    confidence: 0.94,
    technical_context: "Finalizing VerdictHash: 0x9f...22"
  }
];

export const DialecticView = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(3);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/30">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-white">Dialectic Verification Protocol (DVP)</h3>
        </div>
        <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
          Tier 4 (Arbitration)
        </span>
      </div>

      {/* Debate Flow */}
      <div className="p-4 space-y-4">
        {MOCK_DEBATE.map((arg) => (
          <div 
            key={arg.step}
            className={`border rounded-lg transition-all duration-300 ${
              arg.role === 'Judge' 
                ? 'bg-zinc-900 border-zinc-700 shadow-lg' 
                : 'bg-zinc-950/50 border-zinc-800'
            }`}
          >
            <button
              onClick={() => setExpandedStep(expandedStep === arg.step ? null : arg.step)}
              className="w-full flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  arg.role === 'Prosecutor' ? 'bg-rose-500' :
                  arg.role === 'Defender' ? 'bg-emerald-500' : 'bg-cyan-500'
                }`} />
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  arg.role === 'Prosecutor' ? 'text-rose-400' :
                  arg.role === 'Defender' ? 'text-emerald-400' : 'text-cyan-400'
                }`}>
                  {arg.role}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-500">
                  Confidence: {(arg.confidence * 100).toFixed(0)}%
                </span>
                {expandedStep === arg.step ? 
                  <ChevronUp className="w-3 h-3 text-zinc-600" /> : 
                  <ChevronDown className="w-3 h-3 text-zinc-600" />
                }
              </div>
            </button>

            {/* Expanded Content */}
            {expandedStep === arg.step && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-zinc-800 pl-3">
                  {arg.claim}
                </p>
                
                {arg.technical_context && (
                  <p className="mt-2 text-[11px] text-zinc-500 font-mono">
                    // {arg.technical_context}
                  </p>
                )}

                {arg.citations.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {arg.citations.map((cite) => (
                      <span 
                        key={cite.id} 
                        className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded cursor-help hover:text-white transition-colors"
                        title={cite.type}
                      >
                        <FileText className="w-2.5 h-2.5" />
                        {cite.id}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};```

####### File: governance/features/judiciary/Judiciary.tsx
####*Size: 12K, Lines: 229, Type: HTML document, ASCII text*

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

###### Directory: governance/features/underwriting

####### File: governance/features/underwriting/AgentHierarchy.tsx
####*Size: 4.0K, Lines: 90, Type: Java source, ASCII text*

```
import React from 'react';
import { Agent } from '../../core/types';

interface AgentSwarmViewProps {
  rootAgent: Agent;
}

const HierarchyNode = ({ role, name, bond, isRoot, status }: { 
  role: string; name: string; bond: string; isRoot?: boolean; status?: string 
}) => (
  <div className={`relative p-3 rounded-lg border transition-all ${
    isRoot 
      ? 'bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
      : 'bg-zinc-900 border-zinc-800'
  } w-48 text-center`}>
    
    <div className="flex justify-between items-center mb-2">
      <span className="text-[9px] uppercase tracking-wide text-zinc-500">{role}</span>
      {status === 'Slashed' && (
        <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">SLASHED</span>
      )}
    </div>
    
    <div className="text-sm font-medium text-white truncate">{name}</div>
    
    <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 bg-zinc-950/50 rounded px-2 py-1.5 border border-zinc-800/50">
      <span>Bond</span>
      <span className={isRoot ? 'text-cyan-400' : 'text-zinc-300'}>${bond}</span>
    </div>
  </div>
);

export const AgentSwarmView = ({ rootAgent }: AgentSwarmViewProps) => {
  // In a real app, this data would come from the Delegation Graph Ledger
  // For now, we simulate workers based on the root agent's risk profile
  const workers = [
    { role: 'Data Fetcher', name: 'Oracle Connect v1', bond: '2,500' },
    { role: 'Reasoning', name: 'Llama-3-70b-Instruct', bond: '10,000' },
    { role: 'Execution', name: 'SafeWallet Signer', bond: '15,000' }
  ];

  return (
    <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950/50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Root (The Planner) */}
        <HierarchyNode 
          role="Planner Node (Manager)" 
          name={rootAgent.name} 
          bond={(rootAgent.totalStaked / 100).toLocaleString()} 
          isRoot
          status={rootAgent.status}
        />
        
        {/* Connection Lines */}
        <div className="relative h-6 w-full max-w-[280px]">
          {/* Vertical Stem */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-zinc-700" />
          {/* Horizontal Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-700" />
          {/* Vertical Connectors to children */}
          <div className="absolute bottom-0 left-0 h-2 w-px bg-zinc-700 translate-y-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-px bg-zinc-700 translate-y-full" />
          <div className="absolute bottom-0 right-0 h-2 w-px bg-zinc-700 translate-y-full" />
        </div>
        
        {/* Workers */}
        <div className="flex gap-4 pt-2">
          {workers.map((worker, idx) => (
            <HierarchyNode 
              key={idx}
              role={`Worker ${idx + 1}`} 
              name={worker.name} 
              bond={worker.bond} 
            />
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex items-start gap-2 bg-blue-500/5 border border-blue-500/10 p-3 rounded text-[11px] text-blue-200">
        <div className="w-4 h-4 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">i</div>
        <p>
          Recursive Liability Active: If any Worker commits a fault (e.g., Equivocation), 
          <span className="font-bold text-white"> {rootAgent.name}</span>'s bond is slashed first to compensate the user.
        </p>
      </div>
    </div>
  );
};```

####### File: governance/features/underwriting/Underwriting.tsx
####*Size: 16K, Lines: 430, Type: Java source, ASCII text*

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
}```

##### Directory: governance/node_modules (skipped)

##### Directory: governance/shared

###### Directory: governance/shared/layout

####### File: governance/shared/layout/Header.tsx
####*Size: 8.0K, Lines: 172, Type: Java source, Unicode text, UTF-8 text*

```
import React, { useState, useEffect, useRef } from 'react';
import { Menu, LayoutGrid, LogOut, Copy, ChevronDown, ExternalLink } from 'lucide-react'; 
import { useLocation, Link } from 'react-router-dom';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext'; 
import { MegaMenu } from './MegaMenu'; 

const ROUTE_NAMES: Record<string, string> = {
  '/': 'Dashboard',
  '/governance': 'Governance',
  '/underwriting': 'Underwriting',
  '/judiciary': 'Judiciary',
};

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { isConnected, connectWallet, disconnectWallet, user, balance } = useNetwork();
  const { addToast } = useToast();
  
  // State for MegaMenu instead of CommandPalette
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Keyboard shortcut to open MegaMenu (Cmd+K or Cmd+M could work, sticking to click for now or Cmd+K as legacy alias)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setMenuOpen(prev => !prev);
      }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      <MegaMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        currentApp="governance" 
      />
      
      <header className="h-14 sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-between px-4">
        
        {/* Left: Mobile Menu + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-zinc-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>

          <nav className="flex items-center text-sm">
            <Link to="/" className="text-zinc-500 hover:text-white transition-colors font-semibold tracking-tight">
              IOI
            </Link>
            <span className="mx-2 text-zinc-700">/</span>
            <span className="text-white font-medium tracking-wide">{currentPathName}</span>
          </nav>
        </div>

        {/* Center: Network Switcher (Replaces Search) */}
        <div className="hidden md:block">
            <button 
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:border-zinc-700 hover:text-white hover:bg-zinc-900 transition-all"
            >
              <LayoutGrid className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors" />
              <span>Network Services</span>
              <kbd className="hidden lg:inline-block ml-2 text-[9px] bg-zinc-800 px-1 py-0.5 rounded text-zinc-500 group-hover:text-zinc-400">⌘K</kbd>
            </button>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {isConnected && user ? (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-3 h-9 pl-3 pr-2 rounded-full border transition-all duration-200 ${
                  profileOpen 
                    ? 'bg-zinc-800 border-zinc-700' 
                    : 'border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-zinc-500 leading-none mb-0.5">Balance</div>
                    <div className="text-xs font-mono text-zinc-200 leading-none">{balance.toLocaleString()} IOI</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 ring-2 ring-zinc-950" />
                <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* Address */}
                  <div className="p-4 border-b border-zinc-800 bg-zinc-950/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-500">Connected DID</span>
                      <button onClick={copyDid} className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-800 rounded">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 break-all bg-cyan-950/20 border border-cyan-900/30 p-2 rounded">
                        {user.economicDid}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 divide-x divide-zinc-800 border-b border-zinc-800">
                    <div className="p-3 text-center hover:bg-zinc-800/50 transition-colors">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Reputation</div>
                      <div className="text-lg font-medium text-white mt-1">{user.reputation}</div>
                    </div>
                    <div className="p-3 text-center hover:bg-zinc-800/50 transition-colors">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Voting Power</div>
                      <div className="text-lg font-medium text-white mt-1">{(balance / 1000).toFixed(1)}k</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2 space-y-1">
                    <a href="#" className="flex items-center justify-between px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors group">
                        <span>View on Explorer</span>
                        <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                    </a>
                    <button 
                      onClick={() => { disconnectWallet(); setProfileOpen(false); }}
                      className="w-full flex items-center px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                    >
                      <LogOut className="w-3 h-3 mr-2" />
                      Disconnect Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="h-9 px-4 rounded-full bg-white text-zinc-950 text-xs font-bold uppercase tracking-wide hover:bg-zinc-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)]"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>
    </>
  );
};```

####### File: governance/shared/layout/MegaMenu.tsx
####*Size: 8.0K, Lines: 102, Type: Java source, ASCII text*

```
import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { IOI_APPS, getAppUrl, NetworkAppId } from '../../core/network-config';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentApp: NetworkAppId;
}

export const MegaMenu = ({ isOpen, onClose, currentApp }: MegaMenuProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4" 
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Menu Content */}
      <div 
        className="relative w-full max-w-4xl bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
             </div>
             <div>
                <h2 className="text-lg font-bold text-white tracking-tight">IOI Network</h2>
                <p className="text-xs text-zinc-500 font-mono">Select a subsystem to launch</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="text-xs font-mono text-zinc-500 hover:text-white px-3 py-1.5 rounded border border-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            ESC
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {IOI_APPS.map((app) => {
            const isCurrent = app.id === currentApp;
            return (
              <a
                key={app.id}
                href={isCurrent ? '#' : getAppUrl(app)}
                onClick={isCurrent ? (e) => e.preventDefault() : undefined}
                className={`
                  group relative p-5 rounded-xl border transition-all duration-300
                  ${isCurrent 
                    ? 'bg-zinc-900/50 border-cyan-500/20 cursor-default ring-1 ring-cyan-500/20' 
                    : 'bg-zinc-900/20 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5'}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg transition-colors ${isCurrent ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-600'}`}>
                    <app.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                      {app.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
                      {app.status === 'beta' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>}
                      {app.status === 'maintenance' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                  </div>
                </div>
                
                <h3 className={`text-base font-semibold mb-1.5 flex items-center gap-2 ${isCurrent ? 'text-white' : 'text-zinc-200 group-hover:text-cyan-400 transition-colors'}`}>
                  {app.name}
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  {app.description}
                </p>

                {isCurrent && (
                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-cyan-500 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50">
                        CURRENT
                    </div>
                )}
              </a>
            );
          })}
        </div>

        <div className="px-8 py-4 bg-zinc-950 border-t border-zinc-800 text-[10px] text-zinc-600 font-mono flex justify-between items-center">
          <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-emerald-500 rounded-full"></span>Mainnet: Operational</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">Block: 12,940,221</span>
          </div>
          <div className="flex gap-4">
              <a href="#" className="hover:text-zinc-400 transition-colors">Support</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Status</a>
          </div>
        </div>
      </div>
    </div>
  );
};```

####### File: governance/shared/layout/NetworkHeader.tsx
####*Size: 4.0K, Lines: 72, Type: HTML document, ASCII text, with very long lines (783)*

```
// File: governance/shared/layout/NetworkHeader.tsx
import React from 'react';
import { IOI_APPS, getAppUrl, NetworkAppId } from '../../core/network-config';
import ioiLogo from '../../assets/ioi-logo-dark.svg';

interface NetworkHeaderProps {
  currentAppId: NetworkAppId;
}

export const NetworkHeader = ({ currentAppId }: NetworkHeaderProps) => {
  return (
    <nav className="h-9 bg-black border-b border-zinc-800 flex items-center justify-between px-4 z-[60] fixed top-0 w-full">
      {/* Left: Network Logo & App Switcher */}
      <div className="flex items-center gap-6">
        {/* Master Brand */}
        <a href={getAppUrl(IOI_APPS[0])} className="flex items-center gap-2 group">
          <img 
            src={ioiLogo} 
            alt="IOI Network" 
            className="h-4 w-auto opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        </a>

        {/* Divider */}
        <div className="h-3 w-px bg-zinc-800" />

        {/* App Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {IOI_APPS.map((app) => {
            const isActive = app.id === currentAppId;
            return (
              <a
                key={app.id}
                href={getAppUrl(app)}
                className={`
                  flex items-center gap-2 px-3 py-1 rounded text-[11px] font-medium transition-all
                  ${isActive 
                    ? 'text-white bg-zinc-900 shadow-sm ring-1 ring-zinc-800' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}
                `}
              >
                <span className={isActive ? 'text-cyan-400' : 'opacity-70'}>
                  <app.icon className="w-3.5 h-3.5" />
                </span>
                {app.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* Right: Global Utilities */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mainnet: <span className="text-zinc-300">Operational</span></span>
        </div>

        <a 
          href="https://github.com/ioi-network" 
          target="_blank" 
          rel="noreferrer"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <span className="sr-only">GitHub</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </nav>
  );
};```

####### File: governance/shared/layout/Sidebar.tsx
####*Size: 8.0K, Lines: 145, Type: Java source, ASCII text*

```
// File: governance/shared/layout/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Vote, 
  ShieldCheck, 
  Scale, 
  ChevronLeft,
  ChevronRight,
  Circle,
  Grid
} from 'lucide-react';
import { MegaMenu } from './MegaMenu';

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
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setBlockHeight(h => h + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MegaMenu 
        isOpen={megaMenuOpen} 
        onClose={() => setMegaMenuOpen(false)} 
        currentApp="governance" 
      />

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 z-50 bg-zinc-950 border-r border-zinc-800
        transform transition-all duration-200 ease-out
        top-9 bottom-0 /* Pushed down by NetworkHeader */
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-16' : 'w-56'} 
        flex flex-col
      `}>
        
        {/* Collapse toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white rounded-full transition-colors z-50"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* App Context Header (Replaces SVG Logo) */}
        <button 
          onClick={() => setMegaMenuOpen(true)}
          className={`h-14 flex items-center border-b border-zinc-800 hover:bg-zinc-900 transition-colors group relative ${collapsed ? 'justify-center px-0' : 'px-4 justify-between'}`}
          title="Switch App"
        >
          {collapsed ? (
            <Grid className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400" />
          ) : (
            <>
              <span className="font-bold text-white tracking-tight">Governance</span>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 group-hover:border-zinc-700 transition-colors">v2.4</span>
            </>
          )}
        </button>

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

###### File: governance/shared/Skeleton.tsx
###*Size: 8.0K, Lines: 194, Type: HTML document, ASCII text*

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

###### File: governance/shared/UIComponents.tsx
###*Size: 4.0K, Lines: 128, Type: Java source, ASCII text*

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

##### File: governance/App.tsx
##*Size: 4.0K, Lines: 61, Type: Java source, ASCII text*

```
// File: governance/App.tsx
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { NetworkProvider } from './context/NetworkContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { Sidebar } from './shared/layout/Sidebar';
import { Header } from './shared/layout/Header';
import { NetworkHeader } from './shared/layout/NetworkHeader';

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
          <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100">
            
            {/* Global Top Bar */}
            <NetworkHeader currentAppId="governance" />

            <div className="flex flex-1 relative pt-9"> {/* pt-9 accounts for fixed header */}
              <Sidebar 
                mobileOpen={mobileOpen} 
                setMobileOpen={setMobileOpen} 
                collapsed={collapsed} 
                setCollapsed={setCollapsed}
              />
              
              <div className={`flex-1 flex flex-col min-h-[calc(100vh-2.25rem)] transition-all duration-200 ${
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
            
          </div>
        </Router>
      </NetworkProvider>
    </ToastProvider>
  );
}```

##### File: governance/index.html
##*Size: 4.0K, Lines: 135, Type: HTML document, ASCII text*

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

##### File: governance/index.tsx
##*Size: 4.0K, Lines: 14, Type: Java source, ASCII text*

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

##### File: governance/metadata.json
##*Size: 4.0K, Lines: 3, Type: JSON data*

##*File content not included (exceeds threshold or non-text file)*

##### File: governance/package.json
##*Size: 4.0K, Lines: 24, Type: JSON data*

##*File content not included (exceeds threshold or non-text file)*

##### File: governance/package-lock.json
##*Size: 80K, Lines: 2281, Type: JSON data*

##*File content not included (exceeds threshold or non-text file)*

##### File: governance/README.md
##*Size: 4.0K, Lines: 71, Type: Unicode text, UTF-8 text*

```markdown
# IOI Governance Portal

The command center for the IOI DAO. This application allows token holders to vote on protocol upgrades, calibrate the AI Judiciary, and underwrite agent liability.

**Live URL:** [gov.ioi.network](https://gov.ioi.network)

## 🏛 Core Features

This application implements the governance and economic primitives defined in the IOI Whitepaper:

### 1. Protocol Governance
*   **PIP (Protocol Improvement Proposals):** Voting interfaces for upgrading the A-DMFT consensus or changing base fees.
*   **Epoch Visualization:** Real-time tracking of network epochs (Registration -> Snapshot -> Voting -> Execution).

### 2. The Judiciary (Arbitration Lane)
*   **Dialectic Protocol Visualization:** A UI to view the "AI Courtroom" process where the Prosecutor (AI) and Defender (AI) argue over a slashable offense.
*   **Juror Calibration:** Interfaces for updating the `Recommended_Juror_Model_CID` (e.g., upgrading from Llama-3 to DeepSeek).

### 3. Underwriting (Insurance Pools)
*   **Recursive Liability:** A hierarchical view of Agent Swarms to visualize bond coverage.
*   **Delegated Staking:** Users stake $IOI tokens on specific Agent Manifests to earn yield in exchange for assuming liability risk.

## ⚡️ Technical Stack

*   **Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS (Zinc/Dark mode only - "Financial Terminal" aesthetic)
*   **State:** React Context (Simulating Optimistic UI updates for high-latency settlement)
*   **Visualization:** Recharts (for TVL and Voting Power) + Custom DAG Visualizers

## 🚀 Development

### Setup

Ensure you have installed dependencies at the monorepo root.

```bash
# From root
pnpm install
```

### Run Locally

```bash
# From root
pnpm --filter governance dev

# OR from apps/governance
npm run dev
```

### Architecture Note: Optimistic UI

Because the IOI Mainnet (Mode 2) is a settlement layer, block times may be slower than typical interaction speeds. This app uses an **Optimistic Context** (`NetworkContext.tsx`) to simulate transaction confirmations instantly while "pending" on the simulated chain.

## 📂 Directory Structure

```
/features
  /dashboard      # Network overview (TVL, Active Proposals)
  /governance     # Voting logic and Proposal Cards
  /judiciary      # Slashing events and Dialectic Views
  /underwriting   # Agent Staking and Hierarchy visualization
/context          # Network simulation (Wallet, Balance, Pending Tx)
/shared           # Reusable skeletons and layout components
```

## 🧪 Mock Data

During development, the app runs against `core/constants.ts` which simulates:
*   Active Agents (Tier 1 - Tier 3)
*   Recent Slashing Events (Equivocation proofs)
*   Active Proposals (PIP-104, JCP-009)```

##### File: governance/tsconfig.json
##*Size: 4.0K, Lines: 28, Type: JSON data*

##*File content not included (exceeds threshold or non-text file)*

##### File: governance/vite.config.ts
##*Size: 4.0K, Lines: 23, Type: Java source, ASCII text*

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

#### Directory: www

##### Directory: www/src

###### Directory: www/src/features

####### Directory: www/src/features/landing

###### Directory: www/src/shared

###### File: www/src/App.tsx
###*Size: 8.0K, Lines: 114, Type: HTML document, ASCII text*

```
import React, { useState } from 'react';
import { ShieldCheck, BookOpen, BarChart3, ArrowRight, Terminal, Globe } from 'lucide-react';

const SubdomainCard = ({ 
  title, 
  desc, 
  icon: Icon, 
  url, 
  status, 
  metric 
}: { 
  title: string; 
  desc: string; 
  icon: any; 
  url: string;
  status: 'online' | 'maintenance' | 'beta';
  metric?: string;
}) => (
  <a 
    href={url}
    className="group relative flex flex-col p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
        <Icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
      </div>
      <div className="flex items-center gap-2">
        {status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />}
        {status === 'beta' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />}
        <span className="text-[10px] font-mono uppercase text-zinc-500">{status}</span>
      </div>
    </div>
    
    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
      {title}
      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
    </h3>
    <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-1">
      {desc}
    </p>

    {metric && (
      <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
        <span className="text-xs text-zinc-600 font-mono">Telemetry</span>
        <span className="text-xs text-zinc-300 font-mono">{metric}</span>
      </div>
    )}
  </a>
);

export default function RootApp() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/20">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">IOI Network</h1>
              <p className="text-sm text-zinc-500 font-mono">Mainnet Gateway v2.4.0</p>
            </div>
          </div>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">
            The IOI Network is a decentralized infrastructure layer for autonomous AI agents. 
            Access the protocol subsystems below.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SubdomainCard 
            title="Governance"
            url="https://gov.ioi.network"
            icon={ShieldCheck}
            desc="Vote on protocol upgrades, manage the judiciary, and underwrite agent swarms."
            status="online"
            metric="TVL: $542M"
          />
          
          <SubdomainCard 
            title="Technical Core"
            url="https://docs.ioi.network"
            icon={BookOpen}
            desc="Developer documentation, kernel specifications, and live source verification."
            status="online"
            metric="v2.4.0-rc1"
          />
          
          <SubdomainCard 
            title="Network Stats"
            url="https://stats.ioi.network"
            icon={BarChart3}
            desc="Real-time block explorer, validator metrics, and consensus finality charts."
            status="beta"
            metric="1.2s Finality"
          />
        </div>

        <footer className="mt-24 pt-8 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-600 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Systems Normal</span>
          </div>
          <div>
            &copy; 2026 IOI Foundation
          </div>
        </footer>
      </div>
    </div>
  );
}```

