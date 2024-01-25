/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: number;
  readonly VITE_VERSION: string;

  readonly VITE_GRAASP_APP_KEY: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_GRAASP_API_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
