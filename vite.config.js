import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  resolve: {
    alias: {
      "@ericblade/quagga2": path.resolve(
        __dirname,
        "node_modules/@ericblade/quagga2/src/quagga.js"
      ),
    },
  },
});
