#!/usr/bin/env node
/**
 * sync-docs.mjs
 *
 * Copies documentation from neighboring tool repositories into this Docusaurus
 * site's tool directories. Optionally watches for changes in dev mode.
 *
 * Usage:
 *   node scripts/sync-docs.mjs                          # sync all configured repos (one-time)
 *   node scripts/sync-docs.mjs --repos cli-reporter     # sync specific repo (one-time)
 *   node scripts/sync-docs.mjs --watch                  # sync all + watch for changes
 *   node scripts/sync-docs.mjs --watch --repos cli-reporter  # sync one + watch
 *
 * Or via npm scripts:
 *   npm run sync
 *   npm run sync -- --repos testbench-cli-reporter
 *   npm run sync:watch
 *   npm run sync:watch -- --repos testbench-cli-reporter
 *
 * Combined dev server + sync:
 *   npm run dev                                          # sync all + dev server
 *   SYNC_REPOS=testbench-cli-reporter npm run dev        # sync one + dev server
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const watchMode = args.includes('--watch');

const reposArgIdx = args.indexOf('--repos');
const reposFromArgs =
  reposArgIdx !== -1
    ? args
        .slice(reposArgIdx + 1)
        .filter((a) => !a.startsWith('--'))
    : [];

// Also accept SYNC_REPOS env var (comma-separated), useful with concurrently
const reposFromEnv = process.env.SYNC_REPOS
  ? process.env.SYNC_REPOS.split(',').map((s) => s.trim()).filter(Boolean)
  : [];

const requestedRepos = [...reposFromArgs, ...reposFromEnv];

// ---------------------------------------------------------------------------
// Load tools.config.json
// ---------------------------------------------------------------------------

const configPath = path.join(siteDir, 'tools.config.json');

if (!fs.existsSync(configPath)) {
  console.error(`[sync] tools.config.json not found at ${configPath}`);
  process.exit(1);
}

const toolsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// ---------------------------------------------------------------------------
// Determine which tools to process
// ---------------------------------------------------------------------------

const toolIds =
  requestedRepos.length > 0 ? requestedRepos : Object.keys(toolsConfig);

let anySynced = false;

for (const toolId of toolIds) {
  const config = toolsConfig[toolId];

  if (!config) {
    console.warn(`[sync] "${toolId}" not found in tools.config.json — skipping`);
    continue;
  }

  const srcDir = path.resolve(siteDir, '..', '..', toolId, 'docs');
  const destDir = path.join(siteDir, toolId);

  if (!fs.existsSync(srcDir)) {
    console.warn(
      `[sync] "${toolId}": source not found at ${srcDir} — skipping`,
    );
    continue;
  }

  syncDir(srcDir, destDir, toolId);
  anySynced = true;

  if (watchMode) {
    startWatcher(toolId, srcDir, destDir);
  }
}

if (!anySynced) {
  console.log('[sync] Nothing to sync.');
  if (!watchMode) process.exit(0);
}

if (watchMode) {
  console.log('[sync] Watching for changes… (Ctrl+C to stop)');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function syncDir(src, dest, label) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      syncDir(srcPath, destPath, label);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log(`[sync] "${label}": synced from ${src}`);
}

function startWatcher(toolId, srcDir, destDir) {
  // Debounce map: filename → timeout handle
  const debounceMap = new Map();

  fs.watch(srcDir, { recursive: true }, (event, filename) => {
    if (!filename) return;

    // Debounce rapid successive events (editors often emit several on save)
    if (debounceMap.has(filename)) {
      clearTimeout(debounceMap.get(filename));
    }

    debounceMap.set(
      filename,
      setTimeout(() => {
        debounceMap.delete(filename);
        handleChange(toolId, srcDir, destDir, filename);
      }, 50),
    );
  });
}

function handleChange(toolId, srcDir, destDir, relPath) {
  const srcPath = path.join(srcDir, relPath);
  const destPath = path.join(destDir, relPath);

  if (!fs.existsSync(srcPath)) {
    // Deleted
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
      console.log(`[sync] "${toolId}": deleted  ${relPath}`);
    }
    return;
  }

  const stat = fs.statSync(srcPath);

  if (stat.isDirectory()) {
    fs.mkdirSync(destPath, { recursive: true });
  } else {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log(`[sync] "${toolId}": updated  ${relPath}`);
  }
}
