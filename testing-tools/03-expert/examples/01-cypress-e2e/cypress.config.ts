import { defineConfig } from 'cypress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: path.join(root, 'cypress/e2e/**/*.cy.{js,ts}'),
    supportFile: path.join(root, 'cypress/support/e2e.ts'),
    fixturesFolder: path.join(root, 'cypress/fixtures'),
    screenshotsFolder: path.join(root, 'cypress/screenshots'),
    videosFolder: path.join(root, 'cypress/videos'),
    video: false,
    setupNodeEvents() {
      // plugin hooks (coverage, tasks) ต่อยอดได้ที่นี่
    },
  },
});
