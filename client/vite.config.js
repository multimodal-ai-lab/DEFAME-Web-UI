import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Ensure Vite is accessible in Docker
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Ensure hot reload works in Docker
    },
    historyApiFallback: true, // Fix refresh issue for React Router
  },
});
