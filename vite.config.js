import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://oldshares.clearclaim.in/
export default defineConfig({
  base: "/",
  plugins: [react()],
});