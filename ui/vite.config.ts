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
  server: {
    proxy: {
      "/api": {
        target: `http://${apiHost}:${apiPort}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    port: uiPort,
  },
});
