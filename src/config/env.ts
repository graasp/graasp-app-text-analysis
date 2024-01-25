export const GRAASP_APP_KEY = import.meta.env.VITE_GRAASP_APP_KEY;
export const APP_VERSION = import.meta.env.VITE_VERSION;
export const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
export const ENABLE_MOCK_API =
  import.meta.env.VITE_ENABLE_MOCK_API === 'true' || false;
export const GRAASP_API_HOST =
  import.meta.env.VITE_GRAASP_API_HOST || 'http://localhost:3000';
