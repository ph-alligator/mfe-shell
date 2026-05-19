import type { RemoteManifest } from '@org/mfe-contracts';

export async function fetchRemoteManifest(): Promise<RemoteManifest> {
  const response = await fetch('/manifest.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load manifest: ${response.status}`);
  }
  return response.json() as Promise<RemoteManifest>;
}
