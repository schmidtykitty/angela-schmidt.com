import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// base "./" lets the built site run from any folder, including GitHub Pages.
export default defineConfig({
  base: "./",
  build: { assetsDir: "" },
  plugins: [react(), tailwindcss()],
});
