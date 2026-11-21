import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // JSX otomatis supaya tes render komponen (.tsx, renderToStaticMarkup) tidak butuh `import React`
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts", "packages/**/*.test.ts"], environment: "node" },
});
