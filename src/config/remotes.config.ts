import type { RemoteManifest } from '@org/mfe-contracts';
import { REMOTE_REGISTRY } from '../remotes/registry.generated';
import { fetchRemoteManifest } from '../services/manifest.service';

function registryToManifest(): RemoteManifest {
  return {
    version: '1.0.0',
    remotes: Object.fromEntries(
      REMOTE_REGISTRY.map((r) => [r.name, r.entry]),
    ),
  };
}

/** Runtime manifest: fetched JSON merged with auto-discovered registry. */
export async function resolveRemoteManifest(): Promise<RemoteManifest> {
  try {
    const fetched = await fetchRemoteManifest();
    return {
      version: fetched.version ?? '1.0.0',
      remotes: {
        ...registryToManifest().remotes,
        ...fetched.remotes,
      },
    };
  } catch {
    return registryToManifest();
  }
}
