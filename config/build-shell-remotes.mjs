import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverRemotes, remotesToShellFederation } from './discover-remotes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Build shell remotes: auto-discover workspace → manifest file override → env override.
 * @param {Record<string, string>} env
 */
export function buildShellRemotes(env = {}) {
  let discovered = discoverRemotes();

  const manifestPath = resolve(__dirname, '../public/manifest.json');
  if (existsSync(manifestPath)) {
    try {
      const json = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      const entries = json.remotes ?? {};
      discovered = discovered.map((r) => ({
        ...r,
        entry: entries[r.name] ?? r.entry,
      }));
    } catch {
      /* use discovered only */
    }
  }

  const federation = remotesToShellFederation(discovered, env);

  for (const r of discovered) {
    const envKey = `VITE_REMOTE_${r.name.toUpperCase()}_URL`;
    if (env[envKey]) {
      federation[r.name].entry = env[envKey];
    }
  }

  return federation;
}
