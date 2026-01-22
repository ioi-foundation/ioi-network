# IOI Network Client Applications

This directory contains the web-based frontends and user interfaces for the IOI Network ecosystem. All applications are built as part of a monorepo structure, utilizing a shared design system and verifying against the core Rust kernel.

## 📂 Applications Overview

| Directory | Application | Port | Description |
| :--- | :--- | :--- | :--- |
| **`www`** | **Landing Page** | `3000` | The main entry point for the network. Features high-level protocol metrics, ecosystem navigation, and marketing information. |
| **`governance`** | **Governance Portal** | `3001` | The DAO dashboard. Allows users to vote on proposals, stake/underwrite agents, and view "Judiciary" slashing events via the Dialectic Verification Protocol. |
| **`documentation`** | **Docs Explorer** | `3002` | The technical reference site. Features a custom "Drift Detection" engine that verifies documentation examples against the actual Rust source code. |

## 🛠 Technology Stack

All applications in this workspace share a unified technology stack:

*   **Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS (customized with Zinc/Dark mode aesthetic)
*   **Language:** TypeScript
*   **Shared Components:** Relies on the `@ioi/ui` package (located in `packages/ui`) for consistent headers, navigation, and UI primitives.

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+
*   npm or pnpm

### Installation

Install dependencies from the root of the monorepo to ensure shared packages are linked correctly:

```bash
# From the root of the monorepo
npm install