import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import blog from "./vite-plugin-blog.js";
export default defineConfig({
  plugins: [react(), blog()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
          "motion": ["framer-motion"],
        },
      },
    },
  },
});