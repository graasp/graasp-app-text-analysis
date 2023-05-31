/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const newConfig = {
    ...config,
    env: {
      ...config.env,
      REACT_APP_API_HOST: process.env.REACT_APP_API_HOST,
      REACT_APP_ENABLE_MOCK_API: process.env.REACT_APP_ENABLE_MOCK_API,
      REACT_APP_GRAASP_APP_KEY: process.env.REACT_APP_GRAASP_APP_KEY,
      REACT_APP_VERSION: process.env.REACT_APP_VERSION,
      REACT_APP_GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    },
  };
  require('@cypress/code-coverage/task')(on, newConfig);
  // include any other plugin code...

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return newConfig;
};
