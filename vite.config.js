import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import grantHandler from "./api/grant-staff.js";
import syncHandler from "./api/sync-staff.js";

function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split("?")[0] : "";
        if (url === "/api/grant-staff" || url === "/api/sync-staff") {
          let bodyData = {};
          if (req.method === "POST") {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const rawBody = Buffer.concat(buffers).toString();
            try {
              bodyData = JSON.parse(rawBody);
            } catch {}
          }
          req.body = bodyData;

          // Polyfill res.status and res.json for Vercel handler compatibility
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
            return res;
          };

          if (url === "/api/grant-staff") {
            return grantHandler(req, res);
          } else {
            return syncHandler(req, res);
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiMiddleware()]
});
