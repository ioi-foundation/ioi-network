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
*   Active Proposals (PIP-104, JCP-009)