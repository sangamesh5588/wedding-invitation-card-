import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Supabase Configuration
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey) 
    : null;

  // API Route for sending wishes to Supabase
  app.post("/api/send-wish", async (req, res) => {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required" });
    }

    if (!supabase) {
      console.warn("Supabase credentials not set. Wish will not be saved.");
      // For demo purposes, we'll return success but log the warning
      return res.json({ 
        success: true, 
        message: "Wish received! (Supabase not configured)" 
      });
    }

    try {
      const { data, error } = await supabase
        .from('wishes')
        .insert([{ name, message }]);

      if (error) throw error;

      res.json({ success: true, message: "Wish saved to Supabase!" });
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      res.status(500).json({ error: "Failed to save wish" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
