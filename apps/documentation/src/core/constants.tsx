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
      // Mapped from: ioi-swarm/python/README.md
      { 
        id: 'swarm/overview', 
        label: 'Overview', 
        type: 'doc', 
        source: src('swarm', 'ioi_swarm/__init__.py'), // Checks doc against actual Python init
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
      // Mapped from: ioi/README.md
      { 
        id: 'intro', 
        label: 'Introduction', 
        type: 'doc', 
        source: src('kernel', 'README.md'), // Self-reference check
        description: 'The AI DePIN Layer.' 
      },
      
      // 1. Architecture Specs (Mapped from ioi/docs/*)
      {
        id: 'specs',
        label: 'Protocol Specifications',
        type: 'category',
        items: [
          // Mapped from: ioi/docs/security/post_quantum.md
          { 
            id: 'kernel/security/post_quantum', 
            label: 'Post-Quantum Security', 
            type: 'doc', 
            source: src('kernel', 'crates/crypto/src/lib.rs') // Validate against crypto crate
          },
          // Mapped from: ioi/docs/crypto/Dilithium.md
          { 
            id: 'kernel/crypto/Dilithium', 
            label: 'Cryptography: Dilithium', 
            type: 'doc', 
            source: src('kernel', 'crates/crypto/src/sign/dilithium/mod.rs') 
          },
          // Mapped from: ioi/docs/commitment/README.md
          {
            id: 'kernel/commitment/README',
            label: 'State Commitment',
            type: 'doc',
            source: src('kernel', 'crates/api/src/commitment/mod.rs')
          }
        ]
      },

      // 2. Crates Reference (Mapped from ioi/crates/*/README.md)
      // These IDs correspond to the folder structure created by sync-repos.js
      {
        id: 'crates-ref',
        label: 'Crates Reference',
        type: 'category',
        items: [
           { id: 'crates/consensus/overview', label: 'Consensus (A-DMFT)', type: 'doc', source: src('kernel', 'crates/consensus/src/lib.rs') },
           { id: 'crates/execution/overview', label: 'Execution (Block-STM)', type: 'doc', source: src('kernel', 'crates/execution/src/lib.rs') },
           { id: 'crates/scs/overview', label: 'Storage (SCS)', type: 'doc', source: src('kernel', 'crates/scs/src/lib.rs') },
           { id: 'crates/networking/overview', label: 'Networking (LibP2P)', type: 'doc', source: src('kernel', 'crates/networking/src/lib.rs') },
           { id: 'crates/drivers/overview', label: 'Drivers (MCP)', type: 'doc', source: src('kernel', 'crates/drivers/src/lib.rs') },
        ]
      },

      // 3. Specific Deep Dives (Manual curation)
      {
        id: 'firewall',
        label: 'Agency Firewall',
        type: 'category',
        items: [
          { id: 'kernel/firewall/rules', label: 'Action Rules', type: 'doc', source: src('kernel', 'crates/services/src/agentic/rules.rs') },
          { id: 'kernel/firewall/scrubber', label: 'Scrubber', type: 'doc', source: src('kernel', 'crates/services/src/agentic/scrubber.rs') },
        ],
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
          { id: 'ddk/ibc/light-clients', label: 'Light Clients', type: 'doc', source: src('kernel', 'crates/services/ibc/light_clients/mod.rs') },
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