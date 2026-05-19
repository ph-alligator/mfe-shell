import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'path';
import { federationShared } from './config/federation.shared.mjs';
import { buildShellRemotes } from './config/build-shell-remotes.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes: buildShellRemotes(env),
        shared: federationShared,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5000,
      strictPort: true,
      cors: true,
    },
    preview: {
      port: 5000,
      strictPort: true,
      cors: true,
    },
    build: {
      target: 'chrome89',
    },
  };
});
