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
  Lock
} from 'lucide-react';
import { NavigationTab, SidebarSection, SourceConfig } from './types';

// Helper to construct source config for Drift Detection
// 'repo' key must match LOCAL_REPO_MAP in App.tsx
const src = (repo: 'kernel' | 'swarm' | 'ddk' | 'api', path: string): SourceConfig => ({ repo, path });

export const SIDEBAR_DATA: Record<NavigationTab, SidebarSection> = {
  // ---------------------------------------------------------------------------
  // SWARM SDK
  // ---------------------------------------------------------------------------
  [NavigationTab.SWARM]: {
    id: 'frameworkSidebar',
    label: 'Swarm SDK',
    color: 'text-blue-400',
    icon: <Code2 className="w-4 h-4" />,
    items: [
      { 
        id: 'swarm/overview', 
        label: 'Overview', 
        type: 'doc', 
        source: src('swarm', 'ioi_swarm/__init__.py'), 
        description: 'Entry point for the IOI Swarm SDK.' 
      },
      {
        id: 'core-primitives',
        label: 'Core Primitives',
        type: 'category',
        items: [
          { id: 'sdk/agents', label: 'Agents', type: 'doc', source: src('swarm', 'ioi_swarm/agent.py') },
          { id: 'sdk/tools', label: 'Tools', type: 'doc', source: src('swarm', 'ioi_swarm/tools.py') },
          { id: 'sdk/client', label: 'Client', type: 'doc', source: src('swarm', 'ioi_swarm/client.py') },
          { id: 'sdk/types', label: 'Types', type: 'doc', source: src('swarm', 'ioi_swarm/types.py') },
        ],
      },
      {
        id: 'ghost-mode',
        label: 'Ghost Mode',
        type: 'category',
        items: [
          { id: 'sdk/ghost/trace-recording', label: 'Trace Recording', type: 'doc', source: src('swarm', 'ioi_swarm/ghost.py') },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // KERNEL & CORE ARCHITECTURE
  // ---------------------------------------------------------------------------
  [NavigationTab.KERNEL]: {
    id: 'kernelSidebar',
    label: 'Kernel & Node',
    color: 'text-orange-400',
    icon: <Cpu className="w-4 h-4" />,
    items: [
      { 
        id: 'intro', 
        label: 'Introduction', 
        type: 'doc', 
        source: src('kernel', 'README.md'), 
        description: 'The AI DePIN Layer.' 
      },
      
      // 1. The Triadic Kernel (Runtime & Isolation)
      {
        id: 'triadic-kernel',
        label: 'The Triadic Kernel',
        type: 'category',
        items: [
          { 
            id: 'crates/validator/README', 
            label: 'Container Architecture', 
            type: 'doc', 
            source: src('kernel', 'crates/validator/src/lib.rs') 
          },
          { 
            id: 'crates/validator/src/standard/orchestration/README', 
            label: 'Orchestration (Control)', 
            type: 'doc', 
            source: src('kernel', 'crates/validator/src/standard/orchestration/mod.rs') 
          },
          { 
            id: 'crates/validator/src/standard/workload/README', 
            label: 'Workload (Sandbox)', 
            type: 'doc', 
            source: src('kernel', 'crates/validator/src/standard/workload/mod.rs') 
          },
          { 
            id: 'crates/validator/src/common/README', 
            label: 'Guardian (Root of Trust)', 
            type: 'doc', 
            source: src('kernel', 'crates/validator/src/common/guardian.rs') 
          },
          { 
            id: 'crates/ipc/README', 
            label: 'Hybrid IPC (gRPC/Shm)', 
            type: 'doc', 
            source: src('kernel', 'crates/ipc/src/lib.rs') 
          },
        ]
      },

      // 2. Agentic Capabilities (Web4 Layer)
      {
        id: 'agentic-layer',
        label: 'Agentic Capabilities',
        type: 'category',
        items: [
          { 
            id: 'crates/services/src/agentic/README', 
            label: 'Agentic Service', 
            type: 'doc', 
            source: src('kernel', 'crates/services/src/agentic/mod.rs') 
          },
          { 
            id: 'crates/services/src/agentic/policy/README', 
            label: 'Agency Firewall', 
            type: 'doc', 
            source: src('kernel', 'crates/services/src/agentic/policy.rs') 
          },
          { 
            id: 'crates/services/src/agentic/scrubber/README', 
            label: 'PII Scrubber', 
            type: 'doc', 
            source: src('kernel', 'crates/services/src/agentic/scrubber.rs') 
          },
          { 
            id: 'crates/scs/README', 
            label: 'Sovereign Context (SCS)', 
            type: 'doc', 
            source: src('kernel', 'crates/scs/src/lib.rs') 
          },
          { 
            id: 'crates/state/src/tree/mhnsw/README', 
            label: 'Vector Index (mHNSW)', 
            type: 'doc', 
            source: src('kernel', 'crates/state/src/tree/mhnsw/mod.rs') 
          },
        ]
      },

      // 3. Hardware Drivers
      {
        id: 'drivers',
        label: 'Hardware Drivers',
        type: 'category',
        items: [
           { 
             id: 'crates/drivers/src/mcp/README', 
             label: 'Model Context Protocol', 
             type: 'doc', 
             source: src('kernel', 'crates/drivers/src/mcp/mod.rs') 
           },
           { 
             id: 'crates/drivers/src/gui/README', 
             label: 'GUI / Accessibility', 
             type: 'doc', 
             source: src('kernel', 'crates/drivers/src/gui/mod.rs') 
           },
        ]
      },

      // 4. Consensus & State
      {
        id: 'consensus-state',
        label: 'Consensus & State',
        type: 'category',
        items: [
          { 
            id: 'crates/consensus/src/admft/README', 
            label: 'A-DMFT Consensus', 
            type: 'doc', 
            source: src('kernel', 'crates/consensus/src/admft.rs') 
          },
          { 
            id: 'crates/execution/README', 
            label: 'Parallel Execution (STM)', 
            type: 'doc', 
            source: src('kernel', 'crates/execution/src/mv_memory.rs') 
          },
          { 
            id: 'crates/state/src/tree/jellyfish/README', 
            label: 'Jellyfish Merkle Tree', 
            type: 'doc', 
            source: src('kernel', 'crates/state/src/tree/jellyfish/mod.rs') 
          },
          { 
            id: 'crates/storage/README', 
            label: 'Storage & WAL', 
            type: 'doc', 
            source: src('kernel', 'crates/storage/src/wal.rs') 
          },
        ]
      },

      // 5. Cryptography
      {
        id: 'cryptography',
        label: 'Cryptography',
        type: 'category',
        items: [
          { 
            id: 'crates/crypto/src/transport/hybrid_kem_tls/README', 
            label: 'Hybrid Post-Quantum TLS', 
            type: 'doc', 
            source: src('kernel', 'crates/crypto/src/transport/hybrid_kem_tls/mod.rs') 
          },
          { 
            id: 'crates/crypto/src/sign/dilithium/README', 
            label: 'Dilithium Signatures', 
            type: 'doc', 
            source: src('kernel', 'crates/crypto/src/sign/dilithium/mod.rs') 
          },
        ]
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // DDK & DRIVERS
  // ---------------------------------------------------------------------------
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
          { id: 'ddk/ibc/light-clients', label: 'Light Clients', type: 'doc', source: src('kernel', 'crates/services/src/ibc/light_clients/mod.rs') },
          { id: 'ddk/ibc/zk-relay', label: 'ZK Relay', type: 'doc', source: src('kernel', 'crates/api/src/ibc/zk.rs') },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // API REFERENCE
  // ---------------------------------------------------------------------------
  [NavigationTab.API]: {
    id: 'apiSidebar',
    label: 'API Reference',
    color: 'text-purple-400',
    icon: <Terminal className="w-4 h-4" />,
    items: [
      { id: 'api/blockchain-proto', label: 'Blockchain Proto', type: 'doc', source: src('api', 'blockchain.proto') },
      { id: 'api/control-proto', label: 'Control Proto', type: 'doc', source: src('api', 'control.proto') },
      { id: 'api/public-proto', label: 'Public Proto', type: 'doc', source: src('api', 'public.proto') },
    ],
  },
};

export const MAPPING_CARDS = [
  {
    title: "Parallel Engine",
    concept: "Block-STM",
    path: "crates/execution/src/mv_memory.rs",
    icon: <Zap className="text-yellow-400" />,
    color: "yellow"
  },
  {
    title: "Agency Firewall",
    concept: "Policy Engine",
    path: "crates/services/src/agentic/policy.rs",
    icon: <Shield className="text-red-400" />,
    color: "red"
  },
  {
    title: "Sovereign Context",
    concept: "Verifiable SCS",
    path: "crates/scs/src/lib.rs",
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
    path: "crates/services/src/identity/mod.rs",
    icon: <Fingerprint className="text-pink-400" />,
    color: "pink"
  }
];