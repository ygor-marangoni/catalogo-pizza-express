import { defineConfig } from "vitest/config";
import { transformWithOxc } from "vite";
import path from "node:path";

export default defineConfig({
  plugins: [{
    name: "jsx-in-javascript",
    enforce: "pre",
    async transform(code, id) {
      if (!/src\/.*\.js$/.test(id)) return null;
      return transformWithOxc(code, id, { lang: "jsx", jsx: { runtime: "automatic" } });
    },
  }],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    include: ["tests/unit/**/*.test.js", "tests/components/**/*.test.jsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
});
