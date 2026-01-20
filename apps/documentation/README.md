# IOI Network Documentation

The official technical reference for the IOI Kernel, Swarm SDK, and Driver Kit (DDK).

**Live URL:** [docs.ioi.network](https://docs.ioi.network)

## Features

*   **Drift Detection:** Automatically compares documentation code blocks against the actual Rust source code (`../../crates`) to warn about outdated examples.
*   **Multi-Repo Navigation:** Unified sidebar for Kernel, SDK, and DDK documentation.
*   **Source Linking:** Direct links to the relevant source files for every concept.

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
    npm run dev --workspace=apps/documentation
    ```

3.  Open [http://localhost:3002](http://localhost:3002)

## Architecture

*   **Framework:** React 19 + Vite
*   **Rendering:** `react-markdown` + `rehype-highlight`
*   **Shared UI:** Imports components from `../../packages/ui`
*   **Content:** Markdown files are served from `public/docs/`.