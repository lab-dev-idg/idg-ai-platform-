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
