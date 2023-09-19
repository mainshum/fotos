import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    viewportHeight: 844,
    viewportWidth: 390,
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
