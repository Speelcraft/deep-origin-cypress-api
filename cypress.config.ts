import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://dummyjson.com',
    specPattern: 'cypress/e2e/**/*.ts',
    supportFile: 'cypress/support/index.ts'
  },
});
