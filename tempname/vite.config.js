import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",   // ✅ enables document/window
    globals: true,          // ✅ allows describe/it without imports
    setupFiles: "./src/setupTests.js", // optional setup file
  },
});

