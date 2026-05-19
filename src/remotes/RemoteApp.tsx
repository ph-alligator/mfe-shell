import { lazy, useMemo } from 'react';
import type { RemoteName } from './registry.generated';
import { remoteLoaders } from './remote-loaders.generated';

const cache = new Map<RemoteName, ReturnType<typeof lazy>>();

export function getRemoteApp(name: RemoteName) {
  if (!cache.has(name)) {
    cache.set(name, lazy(remoteLoaders[name]));
  }
  return cache.get(name)!;
}

export function RemoteApp({ name }: { name: RemoteName }) {
  const Component = useMemo(() => getRemoteApp(name), [name]);
  return <Component />;
}
