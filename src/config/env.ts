export const {
  REACT_APP_GRAASP_APP_KEY,
  REACT_APP_VERSION,
  REACT_APP_GOOGLE_ANALYTICS_ID,
  REACT_APP_ENABLE_MOCK_API,
  REACT_APP_API_HOST,
} = window.Cypress ? Cypress.env() : process.env;

export const MOCK_API = REACT_APP_ENABLE_MOCK_API === 'true';
