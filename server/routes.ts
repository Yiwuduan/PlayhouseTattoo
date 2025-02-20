import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { chatWithAI } from "./openai";
import express from "express";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

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

  app.post("/api/artists/:id/profile-image", async (req, res) => {
    const artistId = parseInt(req.params.id);
    if (!req.files || !req.files.image) {
      res.status(400).json({ message: "No image file uploaded" });
      return;
    }

    const image = req.files.image;
    const fileName = `profile-${artistId}-${Date.now()}${path.extname(image.name)}`;
    const filePath = path.join(uploadsDir, fileName);

    await image.mv(filePath);
    const imageUrl = `/uploads/${fileName}`;

    await storage.updateArtistProfileImage(artistId, imageUrl);
    res.json({ imageUrl });
  });

  app.post("/api/artists/:id/portfolio", async (req, res) => {
    const artistId = parseInt(req.params.id);
    if (!req.files || !req.files.image) {
      res.status(400).json({ message: "No image file uploaded" });
      return;
    }

    const image = req.files.image;
    const title = req.body.title || '';
    const fileName = `portfolio-${artistId}-${Date.now()}${path.extname(image.name)}`;
    const filePath = path.join(uploadsDir, fileName);

    await image.mv(filePath);
    const imageUrl = `/uploads/${fileName}`;

    const portfolioItem = await storage.addPortfolioItem({
      artistId,
      imageUrl,
      title,
      description: null,
      createdAt: new Date(),
    });
    res.json(portfolioItem);
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