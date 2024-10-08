import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

const apiENV = dotenv.config({ processEnv: {}, path: "../api/.env" }).parsed;
const apiHost = apiENV?.["HOST"] ?? "localhost";
const apiPort = parseInt(apiENV?.["API_PORT"] || "8000", 10);
const uiPort = parseInt(apiENV?.["UI_PORT"] || "3000", 10);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    proxy: {
      "/api": {
        target: `http://${apiHost}:${apiPort}`,
        changeOrigin: true,
      },
    },
    port: uiPort,
    host: true,
  },
  server: {
    proxy: {
      "/api": {
        target: `http://${apiHost}:${apiPort}`,
        changeOrigin: true,
      },
    },
    port: uiPort,
    host: true,
  },
});
