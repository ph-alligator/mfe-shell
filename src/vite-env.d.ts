/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_APP_ENV: string;
  readonly [key: `VITE_REMOTE_${string}_URL`]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
