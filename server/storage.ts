import { type Artist, type InsertArtist, type Booking, type InsertBooking, artists, bookings } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllArtists(): Promise<Artist[]>;
  getArtistBySlug(slug: string): Promise<Artist | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class DatabaseStorage implements IStorage {
  async getAllArtists(): Promise<Artist[]> {
    return await db.select().from(artists);
  }

  async getArtistBySlug(slug: string): Promise<Artist | undefined> {
    const [artist] = await db
      .select()
      .from(artists)
      .where(eq(artists.slug, slug));
    return artist;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }
}

export const storage = new DatabaseStorage();