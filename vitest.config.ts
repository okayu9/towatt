import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
