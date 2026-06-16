import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// http://oldshares.clearclaim.in/
export default defineConfig({
  base: "/clearclaim-lp/",
  plugins: [react()],
});