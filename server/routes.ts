import type { Express, Request } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { chatWithAI } from "./openai";
import express from "express";
import path from "path";
import fs from "fs";
import type { UploadedFile } from "express-fileupload";
import { compressAndSaveImage } from "./utils/image";

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
    try {
      const artistId = parseInt(req.params.id);

      if (!req.files || !req.files.image) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const image = req.files.image as UploadedFile;

      if (Array.isArray(image)) {
        return res.status(400).json({ message: "Please upload only one image" });
      }

      // Validate file type
      if (!image.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: "Please upload only image files" });
      }

      const fileName = `profile-${artistId}-${Date.now()}${path.extname(image.name)}`;
      const filePath = path.join(uploadsDir, fileName);

      try {
        // Use the new compression utility
        await compressAndSaveImage(image, filePath, {
          quality: 80,
          maxWidth: 800 // Profile images can be smaller
        });
      } catch (err) {
        console.error('Error processing image:', err);
        return res.status(500).json({ message: "Failed to process image file" });
      }

      const imageUrl = `/uploads/${fileName}`;
      await storage.updateArtistProfileImage(artistId, imageUrl);
      return res.json({ imageUrl });
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      return res.status(500).json({ 
        message: "Failed to upload image", 
        error: error.message || 'Unknown error occurred'
      });
    }
  });

  app.post("/api/artists/:id/portfolio", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);

      if (!req.files || !req.files.images) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      const images = Array.isArray(req.files.images) 
        ? req.files.images 
        : [req.files.images];

      const portfolioItems = [];

      for (const image of images) {
        // Validate file type
        if (!image.mimetype.startsWith('image/')) {
          return res.status(400).json({ 
            message: `File ${image.name} is not an image`
          });
        }

        const title = image.name.split('.')[0];
        const fileName = `portfolio-${artistId}-${Date.now()}-${image.name}`;
        const filePath = path.join(uploadsDir, fileName);

        try {
          // Use the new compression utility with higher quality for portfolio images
          await compressAndSaveImage(image, filePath, {
            quality: 85,
            maxWidth: 1200 // Larger size for portfolio images
          });
        } catch (err) {
          console.error('Error processing image:', err);
          return res.status(500).json({ 
            message: `Failed to process image file ${image.name}`
          });
        }

        const imageUrl = `/uploads/${fileName}`;
        const portfolioItem = await storage.addPortfolioItem({
          artistId,
          imageUrl,
          title,
          description: null,
          createdAt: new Date(),
        });

        portfolioItems.push(portfolioItem);
      }

      return res.json(portfolioItems);
    } catch (error: any) {
      console.error('Error uploading portfolio images:', error);
      return res.status(500).json({ 
        message: "Failed to upload images", 
        error: error.message || 'Unknown error occurred'
      });
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

  app.patch("/api/artists/:id", async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const { bio, specialties } = req.body;

      // Enhanced validation
      if (typeof bio !== 'string' || bio.trim().length === 0) {
        return res.status(400).json({ 
          message: "Invalid request data. Bio must be a non-empty string." 
        });
      }

      if (!Array.isArray(specialties) || specialties.some(s => typeof s !== 'string')) {
        return res.status(400).json({ 
          message: "Invalid request data. Specialties must be an array of strings." 
        });
      }

      // Filter out empty strings and trim values
      const cleanedSpecialties = specialties
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (cleanedSpecialties.length === 0) {
        return res.status(400).json({ 
          message: "Invalid request data. At least one specialty is required." 
        });
      }

      const updatedArtist = await storage.updateArtist(artistId, {
        bio: bio.trim(),
        specialties: cleanedSpecialties
      });

      if (!updatedArtist) {
        return res.status(404).json({ message: "Artist not found" });
      }

      res.json(updatedArtist);
    } catch (error: any) {
      console.error('Error updating artist:', error);
      res.status(500).json({ 
        message: "Failed to update artist", 
        error: error.message || 'Unknown error occurred'
      });
    }
  });

  app.delete("/api/portfolio-items/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid portfolio item ID" });
      }

      await storage.deletePortfolioItem(itemId);
      return res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting portfolio item:', error);
      return res.status(500).json({ 
        message: "Failed to delete portfolio item", 
        error: error.message || 'Unknown error occurred'
      });
    }
  });

  return httpServer;
}