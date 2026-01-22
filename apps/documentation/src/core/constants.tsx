// File: apps/documentation/src/core/constants.tsx
import React from 'react';
import { 
  Code2, 
  Cpu, 
  Layers, 
  Terminal, 
  Shield, 
  Globe, 
  Zap,
  Box,
  ShoppingCart
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
          { id: 'sdk/agents', label: 'Agents', type: 'doc', source: src('swarm', 'ioi_swarm/agent/__init__.py') },
          { id: 'sdk/tools', label: 'Tools', type: 'doc', source: src('swarm', 'ioi_swarm/tools/__init__.py') },
          { id: 'sdk/client', label: 'Client', type: 'doc', source: src('swarm', 'ioi_swarm/client/__init__.py') },
          { id: 'sdk/types', label: 'Types', type: 'doc', source: src('swarm', 'ioi_swarm/types/__init__.py') },
        ],
      },
      {
        id: 'ghost-mode',
        label: 'Ghost Mode',
        type: 'category',
        items: [
          { id: 'sdk/ghost', label: 'Trace Recording', type: 'doc', source: src('swarm', 'ioi_swarm/ghost/__init__.py') },
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
      
      // 1. The Triadic Kernel
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
        ]
      },

      // 2. Agentic Capabilities
      {
        id: 'agentic-layer',
        label: 'Agentic Layer',
        type: 'category',
        items: [
          { 
            id: 'crates/services/src/agentic/README', 
            label: 'Desktop Agent Service', 
            type: 'doc', 
            source: src('kernel', 'crates/services/src/agentic/desktop/service.rs') 
          },
          { 
            id: 'crates/services/src/agentic/policy/README', 
            label: 'Agency Firewall', 
            type: 'doc', 
            source: src('kernel', 'crates/services/src/agentic/policy/mod.rs') 
          },
          { 
            id: 'crates/scs/README', 
            label: 'Sovereign Context (SCS)', 
            type: 'doc', 
            source: src('kernel', 'crates/scs/src/lib.rs') 
          },
          { 
            id: 'crates/state/src/tree/mhnsw/README', 
            label: 'Vector Memory (mHNSW)', 
            type: 'doc', 
            source: src('kernel', 'crates/state/src/tree/mhnsw/mod.rs') 
          },
        ]
      },

      // 3. Consensus & State
      {
        id: 'consensus-state',
        label: 'Consensus & State',
        type: 'category',
        items: [
          { 
            id: 'crates/consensus/src/admft/README', 
            label: 'A-DMFT Consensus', 
            type: 'doc', 
            source: src('kernel', 'crates/consensus/src/admft/mod.rs') 
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
      { 
        id: 'ddk/overview', 
        label: 'Overview', 
        type: 'doc', 
        // FIX: Point to the actual ioi-drivers lib file in the kernel repo
        source: src('kernel', 'crates/drivers/src/lib.rs') 
      },
      
      {
        id: 'native-drivers',
        label: 'Standard Drivers',
        type: 'category',
        items: [
          { 
            id: 'ddk/drivers/gui', 
            label: 'GUI Automation', 
            type: 'doc', 
            source: src('kernel', 'crates/drivers/src/gui/mod.rs') 
          },
          { 
            id: 'ddk/drivers/browser', 
            label: 'Browser (CDP)', 
            type: 'doc', 
            // FIX: Updated path to mod.rs
            source: src('kernel', 'crates/drivers/src/browser/mod.rs') 
          },
          { 
            id: 'ddk/drivers/terminal', 
            label: 'Terminal / Shell', 
            type: 'doc', 
            // FIX: Updated path to mod.rs
            source: src('kernel', 'crates/drivers/src/terminal/mod.rs') 
          },
          { 
            id: 'ddk/drivers/os', 
            label: 'OS Bridge', 
            type: 'doc', 
            // FIX: Updated path to mod.rs
            source: src('kernel', 'crates/drivers/src/os/mod.rs') 
          },
        ],
      },
      
      {
        id: 'protocol-drivers',
        label: 'Protocol Drivers',
        type: 'category',
        items: [
          { 
            id: 'ddk/drivers/mcp', 
            label: 'Model Context Protocol', 
            type: 'doc', 
            source: src('kernel', 'crates/drivers/src/mcp/mod.rs') 
          },
          { 
            id: 'ddk/drivers/ucp', 
            label: 'Universal Commerce (UCP)', 
            type: 'doc', 
            source: src('kernel', 'crates/drivers/src/ucp/mod.rs') 
          },
        ]
      },
      
      {
        id: 'interop',
        label: 'IBC & Interop',
        type: 'category',
        items: [
          { id: 'ddk/ibc/light-clients', label: 'Light Clients', type: 'doc', source: src('kernel', 'crates/services/src/ibc/light_clients/mod.rs') },
          { id: 'ddk/ibc/zk-relay', label: 'ZK Relay (Succinct)', type: 'doc', source: src('kernel', 'crates/zk-driver-succinct/src/lib.rs') },
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
      {
        id: 'control-plane',
        label: 'Control Plane (gRPC)',
        type: 'category',
        items: [
          { 
            id: 'api/blockchain', 
            label: 'Blockchain Service', 
            type: 'doc', 
            source: src('api', 'blockchain/v1/blockchain.proto') 
          },
          { 
            id: 'api/control', 
            label: 'Control Service', 
            type: 'doc', 
            source: src('api', 'control/v1/control.proto') 
          },
        ]
      },
      {
        id: 'public-api',
        label: 'Public Interface',
        type: 'category',
        items: [
          { 
            id: 'api/public', 
            label: 'Public API', 
            type: 'doc', 
            source: src('api', 'public/v1/public.proto') 
          },
        ]
      }
    ],
  },
};

export const MAPPING_CARDS = [
  {
    title: "Agency Firewall",
    concept: "Policy Engine",
    path: "crates/services/src/agentic/policy/mod.rs",
    icon: <Shield className="text-red-400" />,
    color: "red"
  },
  {
    title: "Universal Commerce",
    concept: "UCP Driver",
    path: "crates/drivers/src/ucp/mod.rs",
    icon: <ShoppingCart className="text-emerald-400" />,
    color: "emerald"
  },
  {
    title: "Parallel Execution",
    concept: "Block-STM",
    path: "crates/execution/src/mv_memory.rs",
    icon: <Zap className="text-yellow-400" />,
    color: "yellow"
  },
  {
    title: "Guardian Consensus",
    concept: "A-DMFT",
    path: "crates/consensus/src/admft/mod.rs",
    icon: <Globe className="text-indigo-400" />,
    color: "indigo"
  },
  {
    title: "Model Context",
    concept: "MCP Protocol",
    path: "crates/drivers/src/mcp/mod.rs",
    icon: <Box className="text-pink-400" />,
    color: "pink"
  }
];