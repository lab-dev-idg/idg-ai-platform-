import express from "express";
import path from "path";
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
      const fs = require('fs');
      const fcPath = path.join(process.cwd(), 'firebase-applet-config.json');
      let fc: any = {};
      if (fs.existsSync(fcPath)) {
        fc = JSON.parse(fs.readFileSync(fcPath, 'utf8'));
      }
      const fbKey = process.env.VITE_FIREBASE_API_KEY || fc?.apiKey || "";
      const fbProj = process.env.VITE_FIREBASE_PROJECT_ID || fc?.projectId || "";
      if (!fbKey || !fbProj) {
        firebaseStatus = "Missing";
      } else if (fbKey.includes("YOUR_") || fbKey.length < 10) {
        firebaseStatus = "Invalid";
      } else {
        firebaseStatus = "Connected";
      }
    } catch (e) {
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
  app.use("/api/actions", actionRouter);

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
