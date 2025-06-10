import { defineConfig } from "vite";
import path from "path";
import litcss from "vite-plugin-lit-css";


export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@styles": path.resolve(__dirname, "public/styles"),
    },
  },
  server: {
    proxy: {
      "/auth": "http://localhost:3010",
      "/api": "http://localhost:3010",
    },
  },
  plugins: [litcss()],
});
