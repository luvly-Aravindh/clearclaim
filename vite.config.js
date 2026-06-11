import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// http://oldshares.clearclaim.in/
export default defineConfig({
  base: "http://oldshares.clearclaim.in/",
  plugins: [react()],
});