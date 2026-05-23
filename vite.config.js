import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/plataforma-estudio-g9/",
  server: {
    port: 3002,
    open: true,
  },
});
