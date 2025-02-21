import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: text("is_admin").notNull().default("false"),
});

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  bio: text("bio").notNull(),
  specialties: text("specialties").array().notNull(),
  profileImage: text("profile_image"),
  instagram: text("instagram"),
  experience: text("experience"),
  style: text("style"),
});

// Define artist relations
export const artistRelations = relations(artists, ({ many }) => ({
  portfolioItems: many(portfolioItems),
}));

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  artistId: serial("artist_id").references(() => artists.id),
  imageUrl: text("image_url").notNull(),
  title: text("title"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define portfolio relations
export const portfolioRelations = relations(portfolioItems, ({ one }) => ({
  artist: one(artists, {
    fields: [portfolioItems.artistId],
    references: [artists.id],
  }),
}));

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  artistId: serial("artist_id").references(() => artists.id),
  message: text("message").notNull(),
  date: timestamp("date").notNull(),
});

// About page content
export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  storyTitle: text("story_title").notNull().default("OUR STORY"),
  storyContent: text("story_content").notNull(),
  spaceTitle: text("space_title").notNull().default("THE SPACE"),
  spaceContent: text("space_content").notNull(),
  philosophyTitle: text("philosophy_title").notNull().default("OUR PHILOSOPHY"),
  philosophyContent: text("philosophy_content").notNull(),
  values: jsonb("values").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema for operations
export const insertUserSchema = createInsertSchema(users);
export const insertArtistSchema = createInsertSchema(artists);
export const insertPortfolioItemSchema = createInsertSchema(portfolioItems);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertAboutContentSchema = createInsertSchema(aboutContent);

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;
export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;