import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// --- CONFIGURATION ---
const CORE_REPO = {
  // apps/doc/scripts (start) -> apps/doc (1) -> apps (2) -> monorepo (3) -> parent (4) -> ioi
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
// Copies EVERYTHING (files and folders) from src to dest
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
// Walks the source directory, finds ONLY .md files, and copies them to dest
// while preserving the original folder structure.
const copyMarkdownRecursive = (src, destRoot, relativePath = '') => {
  const currentSrc = path.join(src, relativePath);
  const currentDest = path.join(destRoot, relativePath);
  
  if (!fs.existsSync(currentSrc)) return;

  const items = fs.readdirSync(currentSrc);

  items.forEach(item => {
    const srcItemPath = path.join(currentSrc, item);
    const stats = fs.statSync(srcItemPath);

    if (stats.isDirectory()) {
      // Recurse into subdirectories
      copyMarkdownRecursive(src, destRoot, path.join(relativePath, item));
    } else if (item.endsWith('.md')) {
      // It's a Markdown file! Copy it.
      ensureDir(currentDest);
      fs.copyFileSync(srcItemPath, path.join(currentDest, item));
      // Optional: Log found docs
      // console.log(`     + found doc: ${path.join(relativePath, item)}`);
    }
  });
};

// --- MAIN EXECUTION ---

console.log(`🚀 Starting Sync from IOI Core (${IS_CI ? 'Remote' : 'Local'})...`);

// 1. ACQUIRE SOURCE
// Use local sibling folder for dev speed, or clone from GitHub for CI
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
  { src: 'crates/ipc/proto', dest: 'sources/api/proto' }
];

console.log(`   Syncing Raw Sources...`);
SOURCE_MAPPINGS.forEach(map => {
  const src = path.join(sourcePath, map.src);
  const dest = path.join(PUBLIC_DIR, map.dest);
  
  // Clean previous sync to remove deleted files
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
  
  copyRecursive(src, dest);
});

// 3. SYNC ARCHITECTURE DOCS
// Copies the root /docs folder from the repo (e.g. security/, crypto/ specs)
console.log(`   Syncing Architecture Docs...`);
const docsSrc = path.join(sourcePath, 'docs');
const docsDest = path.join(PUBLIC_DIR, 'docs/kernel'); 

if (fs.existsSync(docsDest)) fs.rmSync(docsDest, { recursive: true, force: true });
copyRecursive(docsSrc, docsDest);

// 4. DEEP SCAN CRATE READMEs
// Walks through crates/** and submodules to find any README.md
console.log(`   Deep Scanning Crate Docs...`);
const cratesSrc = path.join(sourcePath, 'crates');
const cratesDest = path.join(PUBLIC_DIR, 'docs/crates');

if (fs.existsSync(cratesDest)) fs.rmSync(cratesDest, { recursive: true, force: true });
copyMarkdownRecursive(cratesSrc, cratesDest);

// 5. SYNC SPECIAL READMEs
// Maps specific high-level READMEs to specific locations in the doc site
const SPECIALS = [
  // The Python SDK README becomes the Swarm Overview
  { src: 'ioi-swarm/python/README.md', dest: 'docs/swarm/overview.md' },
  // The Root Repo README becomes the Site Intro
  { src: 'README.md', dest: 'docs/intro.md' }
];

SPECIALS.forEach(item => {
  const src = path.join(sourcePath, item.src);
  const dest = path.join(PUBLIC_DIR, item.dest);
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
});

// 6. CLEANUP
if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });

console.log('✅ Sync complete.');