import type { Express, Request } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { chatWithAI } from "./openai";
import express from "express";
import path from "path";
import fs from "fs";
import fileUpload from "express-fileupload";
import type { UploadedFile } from "express-fileupload";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Configure express-fileupload middleware
  app.use(fileUpload({
    createParentPath: true,
    limits: { 
      fileSize: 50 * 1024 * 1024, // 50MB max file size
      files: 1 // Allow only 1 file per request
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
    debug: true,
    safeFileNames: true,
    preserveExtension: true
  }));

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
    try {
      const artistId = parseInt(req.params.id);
      console.log('Files received:', req.files); // Debug log
      console.log('Request headers:', req.headers); // Debug log

      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded'); // Debug log
        res.status(400).json({ message: "No files were uploaded" });
        return;
      }

      const image = req.files.image as UploadedFile;
      if (!image) {
        console.log('No image file found in request'); // Debug log
        res.status(400).json({ message: "No image file found in request" });
        return;
      }

      if (Array.isArray(image)) {
        res.status(400).json({ message: "Please upload only one image" });
        return;
      }

      const fileName = `profile-${artistId}-${Date.now()}${path.extname(image.name)}`;
      const filePath = path.join(uploadsDir, fileName);

      console.log('Moving file to:', filePath); // Debug log
      await image.mv(filePath);
      const imageUrl = `/uploads/${fileName}`;

      await storage.updateArtistProfileImage(artistId, imageUrl);
      res.json({ imageUrl });
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ 
        message: "Failed to upload image", 
        error: error.message || 'Unknown error occurred'
      });
    }
  });

  app.post("/api/artists/:id/portfolio", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      console.log('Files received:', req.files); // Debug log

      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded'); // Debug log
        res.status(400).json({ message: "No files were uploaded" });
        return;
      }

      const image = req.files.image as UploadedFile;
      if (!image) {
        console.log('No image file found in request'); // Debug log
        res.status(400).json({ message: "No image file found in request" });
        return;
      }

      if (Array.isArray(image)) {
        res.status(400).json({ message: "Please upload only one image" });
        return;
      }

      const title = req.body.title || '';
      const fileName = `portfolio-${artistId}-${Date.now()}${path.extname(image.name)}`;
      const filePath = path.join(uploadsDir, fileName);

      console.log('Moving file to:', filePath); // Debug log
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
    } catch (error) {
      console.error('Error uploading portfolio image:', error);
      res.status(500).json({ message: "Failed to upload image", error: error.message });
    }
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