# IOI Network Infrastructure

**The Back Office of the Internet of Intelligence.**

This monorepo contains the core infrastructure, settlement interfaces, and governance tooling for the IOI Network. While [ioi.ai](https://ioi.ai) serves the demand side (Users and Agent Developers), this repository serves the supply and security side (Validators, Solvers, Stakers, and Jurors).

## 🌍 Ecosystem Architecture

The IOI ecosystem is split into two domains to ensure clarity, security, and regulatory insulation:

| Domain | **ioi.ai** (Product) | **ioi.network** (Infrastructure) |
| :--- | :--- | :--- |
| **Role** | The "App Store" & Runtime | The "Central Bank" & "Court" |
| **Audience** | Consumers, Enterprise, Devs | Validators, Solvers, Quants |
| **Focus** | UX, Inference, Agent Discovery | Settlement, Consensus, Liability |
| **Codebase** | Private / Commercial SDKs | **This Repository** |

## 📦 Repository Structure

This is a Turborepo-style monorepo containing the specific dApps required to operate the network.

### Applications (`/apps`)

*   **`apps/governance`**: The DAO interface for PIPs (Protocol Improvement Proposals), Judiciary Calibration, and Underwriting/Insurance management.
*   **`apps/explorer`**: The canonical block explorer. Allows verification of Receipts, Bonded Commitments, and Slashing events.
*   **`apps/portal`**: The "Solver Dashboard." Interfaces for Master Escrow management, Validator staking, and liquidity bridging.
*   **`apps/stats`**: Network telemetry, Labor Gas capacity charts, and Compute Futures pricing.

### Packages (`/packages`)

*   **`packages/ioi-types`**: Canonical TypeScript definitions for Receipts, Manifests, and Settlement Objects.
*   **`packages/chain-connector`**: RPC hooks and optimistic state managers for the A-DMFT consensus.
*   **`packages/ui`**: Shared design system (Zinc/Tailwind) for "Infrastructure-grade" aesthetics.

## 🛠 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

### Installation

```bash
# Install dependencies for all workspaces
pnpm install
```

### Development

To run all infrastructure apps simultaneously (or select specific ones):

```bash
# Run all apps in parallel
pnpm dev

# Run a specific app (e.g., Governance)
pnpm --filter governance dev
```

## 🔐 Security & License

This repository contains the **Network Machinery**.

*   **Core Consensus & Kernel:** Licensed under the **Business Source License (BSL) 1.1**. It converts to Apache 2.0 after 36 months.
*   **Interfaces & SDKs:** Licensed under **MIT/Apache 2.0** to encourage integration.

**Security Disclosures:**
Please report vulnerabilities to `security@ioi.network`. Do not file public issues for critical exploits.

---

[Documentation](https://docs.ioi.network) • [Whitepaper](https://ioi.network/whitepaper) • [Status](https://status.ioi.network)
