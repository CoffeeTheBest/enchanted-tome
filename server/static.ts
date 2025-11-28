import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../dist/public");
  
  app.use(express.static(distPath));
  
  // Serve index.html for all other routes (SPA fallback)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
