# IOI Governance Portal

The command center for the IOI DAO. This application allows token holders to vote on protocol upgrades, calibrate the AI Judiciary, and underwrite agent liability.

**Live URL:** [gov.ioi.network](https://gov.ioi.network)

## Features

*   **Protocol Governance:** Vote on PIPs (Protocol Improvement Proposals).
*   **Judiciary:** Visualize the "Dialectic Verification Protocol" (AI Courtroom) for slashing events.
*   **Underwriting:** Manage delegated stakes and visualize recursive agent liability.
*   **Optimistic UI:** Simulates high-latency blockchain interactions for a responsive user experience.

## Setup

This app is part of the IOI Monorepo and depends on the shared `@ioi/ui` package.

### Prerequisites
*   Node.js 18+
*   npm or pnpm

### Running Locally

1.  **Install Dependencies** (from the monorepo root):
    ```bash
    npm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run dev --workspace=apps/governance
    ```

3.  Open [http://localhost:3001](http://localhost:3001)

## Architecture

*   **Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS (Zinc/Dark mode)
*   **Shared UI:** Imports components from `../../packages/ui`
*   **State:** React Context (`NetworkContext`) for wallet and transaction simulation.