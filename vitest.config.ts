import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"],
    exclude: ["e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "build/**",
        "dist/**",
        "coverage/**",
        "scripts/**",
        "src/styles.css.ts",
        "src/main.ts",
        "src/app/types.ts",
        "vitest.config.ts",
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
