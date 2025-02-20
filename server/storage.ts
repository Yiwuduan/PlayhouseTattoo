import { type Artist, type InsertArtist, type Booking, type InsertBooking, type PortfolioItem, type InsertPortfolioItem, type User, type InsertUser, artists, bookings, portfolioItems, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getAllArtists(): Promise<(Artist & { portfolioItems: PortfolioItem[] })[]>;
  getArtistBySlug(slug: string): Promise<(Artist & { portfolioItems: PortfolioItem[] }) | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  addPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updateArtistProfileImage(artistId: number, imageUrl: string): Promise<void>;
  updateArtist(artistId: number, data: { bio: string; specialties: string[] }): Promise<Artist>;
  // User-related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

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

  async updateArtistProfileImage(artistId: number, imageUrl: string): Promise<void> {
    await db
      .update(artists)
      .set({ profileImage: imageUrl })
      .where(eq(artists.id, artistId));
  }

  async updateArtist(artistId: number, data: { bio: string; specialties: string[] }): Promise<Artist> {
    const [updatedArtist] = await db
      .update(artists)
      .set({
        bio: data.bio,
        specialties: data.specialties,
      })
      .where(eq(artists.id, artistId))
      .returning();

    if (!updatedArtist) {
      throw new Error("Artist not found");
    }

    return updatedArtist;
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

  // User-related methods implementation
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();