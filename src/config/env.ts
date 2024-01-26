export const GRAASP_APP_KEY = import.meta.env.VITE_GRAASP_APP_KEY;
export const APP_VERSION = import.meta.env.VITE_VERSION || 'latest';
export const ENABLE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_API === 'true';
export const GRAASP_API_HOST =
  import.meta.env.VITE_API_HOST || 'http://localhost:3000';
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
export const SENTRY_ENV = import.meta.env.VITE_SENTRY_ENV;
