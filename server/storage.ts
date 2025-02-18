import { type Artist, type InsertArtist, type Booking, type InsertBooking, type PortfolioItem, type InsertPortfolioItem, artists, bookings, portfolioItems } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllArtists(): Promise<(Artist & { portfolioItems: PortfolioItem[] })[]>;
  getArtistBySlug(slug: string): Promise<(Artist & { portfolioItems: PortfolioItem[] }) | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  addPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
}

export class DatabaseStorage implements IStorage {
  async getAllArtists(): Promise<(Artist & { portfolioItems: PortfolioItem[] })[]> {
    const artistsWithPortfolio = await db.query.artists.findMany({
      with: {
        portfolioItems: true,
      },
    });
    return artistsWithPortfolio;
  }

  async getArtistBySlug(slug: string): Promise<(Artist & { portfolioItems: PortfolioItem[] }) | undefined> {
    const [artist] = await db.query.artists.findMany({
      with: {
        portfolioItems: true,
      },
      where: eq(artists.slug, slug),
    });
    return artist;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async addPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [portfolioItem] = await db
      .insert(portfolioItems)
      .values(item)
      .returning();
    return portfolioItem;
  }
}

export const storage = new DatabaseStorage();