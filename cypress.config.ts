import { defineConfig } from "cypress";
import registerCodeCoverageTasks from "@cypress/code-coverage/task";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // https://docs.cypress.io/guides/tooling/code-coverage#Install-the-plugin
      registerCodeCoverageTasks(on, config);

      return config;
    },
  },
});
