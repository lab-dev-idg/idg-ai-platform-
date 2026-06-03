import express from "express";
import path from "path";
import fs from "fs";

// Load environment variables manually from .env/ .env.example before import routers/services
try {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  const activePath = fs.existsSync(envPath) ? envPath : fs.existsSync(envExamplePath) ? envExamplePath : null;
  if (activePath) {
    const lines = fs.readFileSync(activePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const index = trimmed.indexOf('=');
        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim();
        if (key && value) {
          if (!process.env[key] || process.env[key]?.includes('YOUR_') || process.env[key] === 'dg-core-iq') {
            process.env[key] = value;
          }
        }
      }
    }
  }
} catch (e) {
  console.warn("Failed to load environment from file:", e);
}

import { createServer as createViteServer } from "vite";

import { chatRouter } from "./server/routes/chat";
import { actionRouter } from "./server/routes/actions";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes go here FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/diagnostics", (req, res) => {
    const geminiKey = process.env.GEMINI_API_KEY || "";
    const mapsKey = process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || "";
    
    // Firebase checking
    let firebaseStatus = "Missing";
    try {
      const fcPath = path.join(process.cwd(), 'firebase-applet-config.json');
      let fc: any = {};
      if (fs.existsSync(fcPath)) {
        fc = JSON.parse(fs.readFileSync(fcPath, 'utf8'));
      }
      const fbKey = fc?.apiKey || process.env.VITE_FIREBASE_API_KEY || "";
      const getSafeProj = () => {
        return fc?.projectId || process.env.VITE_FIREBASE_PROJECT_ID || "idg-core-iq";
      };
      const fbProj = getSafeProj();
      if (!fbKey || !fbProj) {
        firebaseStatus = "Missing";
      } else if (fbKey.includes("YOUR_") || fbKey.length < 10) {
        firebaseStatus = "Invalid";
      } else {
        firebaseStatus = "Connected";
      }
    } catch {
      firebaseStatus = "Invalid";
    }

    const geminiStatus = !geminiKey ? "Missing" : (geminiKey.includes("YOUR_") || geminiKey.length < 10) ? "Invalid" : "Connected";
    const mapsStatus = !mapsKey ? "Missing" : (mapsKey.includes("YOUR_") || mapsKey.length < 10) ? "Invalid" : "Connected";

    res.json({
      gemini: geminiStatus,
      maps: mapsStatus,
      firebase: firebaseStatus,
    });
  });

  app.use("/api/chat", chatRouter);
  app.use("/api/chats", chatRouter);
  app.use("/api/actions", actionRouter);

  // Global error diagnostic middleware
  const { errorHandler } = await import("./server/middleware/errorHandler");
  app.use(errorHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
