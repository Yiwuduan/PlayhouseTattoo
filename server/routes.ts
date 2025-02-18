import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { chatWithAI } from "./openai";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/artists", async (_req, res) => {
    const artists = await storage.getAllArtists();
    res.json(artists);
  });

  app.get("/api/artists/:slug", async (req, res) => {
    const artist = await storage.getArtistBySlug(req.params.slug);
    if (!artist) {
      res.status(404).json({ message: "Artist not found" });
      return;
    }
    res.json(artist);
  });

  app.post("/api/book", async (req, res) => {
    const result = insertBookingSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid booking data" });
      return;
    }
    
    const booking = await storage.createBooking(result.data);
    res.json(booking);
  });

  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ message: "Message is required" });
      return;
    }

    const response = await chatWithAI(message);
    res.json({ response });
  });

  return httpServer;
}
