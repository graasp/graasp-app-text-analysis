import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

// import setupCoverage from '@cypress/code-coverage/task';

export default defineConfig({
  video: false,
  retries: {
    runMode: 2,
  },
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      // cypress-vite allow to using vite specific features
      // like plugins and virtual imports, import.meta, etc. in e2e tests
      on('file:preprocessor', vitePreprocessor());
      // setupCoverage(on, config);
      return config;
    },
    baseUrl: `http://localhost:${process.env.VITE_PORT || 3335}`,
  },
});
