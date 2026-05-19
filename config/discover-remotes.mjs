import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SHELL_PKG = 'mfe-shell';
const NON_REMOTE_PACKAGES = new Set([
  'mfe-shell',
  'mfe-contracts',
  'design-system',
  'micro-frontend-platform',
]);

/**
 * @typedef {Object} DiscoveredRemote
 * @property {string} name - Module Federation name (e.g. dashboard)
 * @property {string} packageDir - mfe-dashboard
 * @property {string} packageName - @org/mfe-dashboard
 * @property {number} port
 * @property {string} route - /dashboard
 * @property {string} label - Dashboard
 * @property {string} entry - http://localhost:5001/remoteEntry.js
 * @property {string} expose - ./App
 */

/**
 * Read workspace package folders from pnpm-workspace.yaml
 */
function getWorkspacePackages() {
  const wsPath = join(ROOT, 'pnpm-workspace.yaml');
  if (!existsSync(wsPath)) {
    return readdirSync(ROOT, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith('mfe-'))
      .map((d) => d.name);
  }
  const lines = readFileSync(wsPath, 'utf-8').split('\n');
  const dirs = new Set();
  for (const line of lines) {
    const m = line.match(/^\s*-\s*['"]?(mfe-[\w-]+)['"]?\s*$/);
    if (m) dirs.add(m[1]);
  }
  return [...dirs];
}

function parsePort(packageDir) {
  const pkgPath = join(ROOT, packageDir, 'package.json');
  if (!existsSync(pkgPath)) return null;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const devScript = pkg.scripts?.dev ?? '';
  const fromScript = devScript.match(/--port\s+(\d+)/);
  if (fromScript) return Number(fromScript[1]);

  const vitePath = join(ROOT, packageDir, 'vite.config.ts');
  if (existsSync(vitePath)) {
    const vite = readFileSync(vitePath, 'utf-8');
    const portMatch = vite.match(/port:\s*(\d+)/);
    if (portMatch) return Number(portMatch[1]);
  }
  return null;
}

function parseFederationName(packageDir) {
  const vitePath = join(ROOT, packageDir, 'vite.config.ts');
  if (!existsSync(vitePath)) return null;
  const vite = readFileSync(vitePath, 'utf-8');
  const m =
    vite.match(/createRemoteFederation\(\s*\{\s*name:\s*['"]([^'"]+)['"]/s) ||
    vite.match(/federation\(\s*\{\s*name:\s*['"]([^'"]+)['"]/s);
  return m?.[1] ?? null;
}

function toLabel(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Discover all MFE remotes in the workspace (no hardcoded names).
 * @returns {DiscoveredRemote[]}
 */

/**
 * Load remotes from shell manifest when workspace has no sibling MFE packages.
 * @param {string} manifestPath
 * @returns {DiscoveredRemote[]}
 */
export function discoverFromManifest(manifestPath) {
  if (!existsSync(manifestPath)) return [];
  try {
    const json = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    const remotes = json.remotes ?? {};
    const meta = json.meta ?? {};
    return Object.entries(remotes).map(([name, entry]) => {
      const m = meta[name] ?? {};
      const port = m.port ?? 0;
      return {
        name,
        packageDir: m.package ?? `mfe-${name}`,
        packageName: m.package ?? `@org/mfe-${name}`,
        port,
        route: m.route ?? `/${name}`,
        label: m.label ?? toLabel(name),
        entry,
        expose: './App',
      };
    });
  } catch {
    return [];
  }
}


export function discoverRemotes(manifestPath) {
  const packages = getWorkspacePackages();
  /** @type {DiscoveredRemote[]} */
  const remotes = [];

  for (const packageDir of packages) {
    if (NON_REMOTE_PACKAGES.has(packageDir)) continue;

    const name = parseFederationName(packageDir);
    if (!name) continue;

    const port = parsePort(packageDir);
    if (!port) {
      console.warn(`[discover-remotes] Skip ${packageDir}: no port in dev script or vite.config`);
      continue;
    }

    const pkgPath = join(ROOT, packageDir, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

    remotes.push({
      name,
      packageDir,
      packageName: pkg.name ?? packageDir,
      port,
      route: `/${name}`,
      label: toLabel(name),
      entry: `http://localhost:${port}/remoteEntry.js`,
      expose: './App',
    });
  }

  const sorted = remotes.sort((a, b) => a.port - b.port);
  if (sorted.length > 0) return sorted;

  const shellManifest =
    manifestPath ?? join(ROOT, 'mfe-shell/public/manifest.json');
  return discoverFromManifest(shellManifest).sort((a, b) => a.port - b.port);
}

/**
 * @param {DiscoveredRemote[]} remotes
 */
export function remotesToManifest(remotes) {
  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    remotes: Object.fromEntries(remotes.map((r) => [r.name, r.entry])),
    meta: Object.fromEntries(
      remotes.map((r) => [
        r.name,
        { route: r.route, label: r.label, port: r.port, package: r.packageDir },
      ]),
    ),
  };
}

/**
 * @param {DiscoveredRemote[]} remotes
 */
export function remotesToShellFederation(remotes, env = {}) {
  /** @type {Record<string, object>} */
  const out = {};
  for (const r of remotes) {
    const envKey = `VITE_REMOTE_${r.name.toUpperCase()}_URL`;
    const entry = env[envKey] || r.entry;
    out[r.name] = {
      type: 'module',
      name: r.name,
      entry,
      entryGlobalName: r.name,
      shareScope: 'default',
    };
  }
  return out;
}

export function getRemoteTailwindContentGlobs() {
  return ['../mfe-*/src/**/*.{ts,tsx}'];
}
