import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": import.meta.dirname },
  },
  test: {
    environment: "node",
    // Globals let the automation/*.test.mjs files run without resolving "vitest"
    // from outside project/node_modules.
    globals: true,
    include: ["**/*.test.ts", "../automation/**/*.test.mjs"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
