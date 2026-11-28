import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const path = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path("./src"),
    },
  },
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          include: ["test/**/*.unit-spec.{ts,tsx}"],
          name: "unit",
        },
      },
      {
        extends: true,
        test: {
          include: ["test/**/*.integration-spec.{ts,tsx}"],
          name: "integration",
        },
      },
      {
        extends: true,
        test: {
          fileParallelism: false,
          hookTimeout: 120_000,
          include: ["test/**/*.acceptance-spec.{ts,tsx}"],
          name: "acceptance",
          testTimeout: 60_000,
        },
      },
    ],
  },
});
