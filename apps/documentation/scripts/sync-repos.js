// File: apps/documentation/scripts/sync-repos.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// --- CONFIGURATION ---
const CORE_REPO = {
  // apps/documentation/scripts (start) -> apps/documentation (1) -> apps (2) -> root (3) -> parent (4) -> ioi
  localPath: '../../../../ioi', 
  remoteUrl: 'https://github.com/ioi-foundation/ioi.git',
  branch: 'main'
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const TEMP_DIR = path.resolve(__dirname, '../.temp_core');

// Detect if running in GitHub Actions, Vercel, or Netlify
const IS_CI = process.env.CI || process.env.VERCEL || process.env.NETLIFY;

// --- HELPERS ---

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// 1. Recursive Copy (For Source Code)
const copyRecursive = (src, dest) => {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    ensureDir(dest);
    fs.readdirSync(src).forEach(child => copyRecursive(path.join(src, child), path.join(dest, child)));
  } else {
    fs.copyFileSync(src, dest);
  }
};

// 2. Deep Markdown Scanner (For Documentation)
const copyMarkdownRecursive = (src, destRoot, relativePath = '') => {
  const currentSrc = path.join(src, relativePath);
  const currentDest = path.join(destRoot, relativePath);
  
  if (!fs.existsSync(currentSrc)) return;

  const items = fs.readdirSync(currentSrc);

  items.forEach(item => {
    const srcItemPath = path.join(currentSrc, item);
    const stats = fs.statSync(srcItemPath);

    if (stats.isDirectory()) {
      copyMarkdownRecursive(src, destRoot, path.join(relativePath, item));
    } else if (item.endsWith('.md')) {
      ensureDir(currentDest);
      fs.copyFileSync(srcItemPath, path.join(currentDest, item));
    }
  });
};

// --- MAIN EXECUTION ---

console.log(`🚀 Starting Sync from IOI Core (${IS_CI ? 'Remote' : 'Local'})...`);

// 1. ACQUIRE SOURCE
let sourcePath = path.resolve(__dirname, CORE_REPO.localPath);

if (IS_CI || !fs.existsSync(sourcePath)) {
  console.log(`☁️  Cloning ${CORE_REPO.remoteUrl}...`);
  sourcePath = TEMP_DIR;
  
  if (fs.existsSync(sourcePath)) fs.rmSync(sourcePath, { recursive: true, force: true });
  ensureDir(TEMP_DIR);
  
  try {
    execSync(`git clone --depth 1 --branch ${CORE_REPO.branch} ${CORE_REPO.remoteUrl} ${sourcePath}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`❌ Clone failed: ${e.message}`);
    process.exit(1);
  }
} else {
  console.log(`💻 Using local folder: ${sourcePath}`);
}

// 2. SYNC RAW SOURCES
// This copies the actual code files (rs, py, proto) needed for "Drift Detection"
const SOURCE_MAPPINGS = [
  { src: 'crates', dest: 'sources/kernel/crates' },
  { src: 'ioi-swarm/python/src', dest: 'sources/swarm/src' },
  { src: 'crates/ipc/proto', dest: 'sources/api' }
];

console.log(`   Syncing Raw Sources...`);
SOURCE_MAPPINGS.forEach(map => {
  const src = path.join(sourcePath, map.src);
  const dest = path.join(PUBLIC_DIR, map.dest);
  
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
  
  copyRecursive(src, dest);
});

// 3. SYNC ARCHITECTURE DOCS
console.log(`   Syncing Architecture Docs...`);
const docsSrc = path.join(sourcePath, 'docs');
const docsDest = path.join(PUBLIC_DIR, 'docs/kernel'); 

if (fs.existsSync(docsDest)) fs.rmSync(docsDest, { recursive: true, force: true });
copyRecursive(docsSrc, docsDest);

// 4. DEEP SCAN CRATE READMEs
console.log(`   Deep Scanning Crate Docs...`);
const cratesSrc = path.join(sourcePath, 'crates');
const cratesDest = path.join(PUBLIC_DIR, 'docs/crates');

if (fs.existsSync(cratesDest)) fs.rmSync(cratesDest, { recursive: true, force: true });
copyMarkdownRecursive(cratesSrc, cratesDest);

// 5. SYNC SPECIAL READMEs
// Maps specific source files to the paths expected by the frontend's sidebar constants.
const SPECIALS = [
  // --- SWARM SDK ---
  { src: 'ioi-swarm/python/README.md', dest: 'docs/swarm/overview.md' },
  { src: 'ioi-swarm/python/src/ioi_swarm/agent/README.md', dest: 'docs/sdk/agents.md' },
  { src: 'ioi-swarm/python/src/ioi_swarm/tools/README.md', dest: 'docs/sdk/tools.md' },
  { src: 'ioi-swarm/python/src/ioi_swarm/client/README.md', dest: 'docs/sdk/client.md' },
  { src: 'ioi-swarm/python/src/ioi_swarm/types/README.md', dest: 'docs/sdk/types.md' },
  { src: 'ioi-swarm/python/src/ioi_swarm/ghost/README.md', dest: 'docs/sdk/ghost.md' },

  // --- KERNEL ---
  { src: 'README.md', dest: 'docs/intro.md' },
  
  // --- DRIVER KIT (DDK) ---
  { src: 'crates/drivers/README.md', dest: 'docs/ddk/overview.md' },
  
  // Specific Drivers
  { src: 'crates/drivers/src/mcp/README.md', dest: 'docs/ddk/drivers/mcp.md' },
  { src: 'crates/drivers/src/ucp/README.md', dest: 'docs/ddk/drivers/ucp.md' }, 
  { src: 'crates/drivers/src/gui/README.md', dest: 'docs/ddk/drivers/gui.md' },
  { src: 'crates/drivers/src/browser/README.md', dest: 'docs/ddk/drivers/browser.md' },
  { src: 'crates/drivers/src/terminal/README.md', dest: 'docs/ddk/drivers/terminal.md' },
  { src: 'crates/drivers/src/os/README.md', dest: 'docs/ddk/drivers/os.md' },
  
  // Interop / IBC
  { src: 'crates/services/src/ibc/light_clients/README.md', dest: 'docs/ddk/ibc/light-clients.md' },
  { src: 'crates/zk-driver-succinct/README.md', dest: 'docs/ddk/ibc/zk-relay.md' },
  
  // --- API REFERENCE ---
  { src: 'crates/ipc/proto/blockchain/README.md', dest: 'docs/api/blockchain.md' },
  { src: 'crates/ipc/proto/control/README.md', dest: 'docs/api/control.md' },
  { src: 'crates/ipc/proto/public/README.md', dest: 'docs/api/public.md' }
];

console.log(`   Syncing Special Docs...`);
SPECIALS.forEach(item => {
  const src = path.join(sourcePath, item.src);
  const dest = path.join(PUBLIC_DIR, item.dest);
  
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  } else {
    // Non-fatal warning allows the script to run even if some docs are missing during dev
    console.warn(`⚠️  Warning: Special doc source not found: ${item.src}`);
  }
});

// 6. CLEANUP
if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });

console.log('✅ Sync complete.');