import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

const THANKYOU_HTML = resolve(__dirname, "thank-you.html");
const AUDIT_HTML = resolve(__dirname, "Getnos_ClearClaim_AuditFunnel_v2.html");

function serveStaticHtml(filePath) {
  return (req, res, next) => {
    const path = req.url?.split("?")[0];
    const thankyou =
      path === "/thankyou" ||
      path === "/thankyou/" ||
      path === "/thank-you.html";
    const audit =
      path === "/audit-form" ||
      path === "/audit-form/" ||
      path === "/audit.html";

    if (thankyou) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(fs.readFileSync(THANKYOU_HTML, "utf-8"));
      return;
    }
    if (audit) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(fs.readFileSync(AUDIT_HTML, "utf-8"));
      return;
    }
    next();
  };
}

function copyHtmlPage(src, outRel) {
  const outDir = resolve(__dirname, outRel);
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(src, resolve(outDir, "index.html"));
}

// https://oldshares.clearclaim.in/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    {
      name: "static-html-routes",
      configureServer(server) {
        server.middlewares.use(serveStaticHtml());
      },
      configurePreviewServer(server) {
        server.middlewares.use(serveStaticHtml());
      },
      closeBundle() {
        copyHtmlPage(THANKYOU_HTML, "dist/thankyou");
        copyHtmlPage(AUDIT_HTML, "dist/audit-form");
      },
    },
  ],
});
