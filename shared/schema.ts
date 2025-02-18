import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  bio: text("bio").notNull(),
  specialties: text("specialties").array().notNull(),
  portfolio: jsonb("portfolio").notNull().$type<string[]>(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  artistId: serial("artist_id").references(() => artists.id),
  message: text("message").notNull(),
  date: timestamp("date").notNull(),
});

export const insertArtistSchema = createInsertSchema(artists);
export const insertBookingSchema = createInsertSchema(bookings);

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
