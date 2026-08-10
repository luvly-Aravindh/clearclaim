import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

const THANKYOU_HTML = resolve(__dirname, "thank-you.html");

function serveThankYou(req, res, next) {
  const path = req.url?.split("?")[0];
  if (
    path === "/thankyou" ||
    path === "/thankyou/" ||
    path === "/thank-you.html"
  ) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(fs.readFileSync(THANKYOU_HTML, "utf-8"));
    return;
  }
  next();
}

// https://oldshares.clearclaim.in/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    {
      name: "thankyou-route",
      configureServer(server) {
        server.middlewares.use(serveThankYou);
      },
      configurePreviewServer(server) {
        server.middlewares.use(serveThankYou);
      },
      closeBundle() {
        const outDir = resolve(__dirname, "dist/thankyou");
        fs.mkdirSync(outDir, { recursive: true });
        fs.copyFileSync(THANKYOU_HTML, resolve(outDir, "index.html"));
      },
    },
  ],
});
