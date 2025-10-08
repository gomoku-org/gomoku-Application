import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "gomoku-app/context": path.resolve(__dirname, "src/context/GameContext"),
      "gomoku-app/api":     path.resolve(__dirname, "src/api/useApi"),
    },
    dedupe: ["react", "react-dom"],
  },
});
