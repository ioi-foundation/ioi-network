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
};