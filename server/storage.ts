import { type Artist, type InsertArtist, type Booking, type InsertBooking } from "@shared/schema";
import { artistsData } from "@shared/data";

export interface IStorage {
  getAllArtists(): Promise<Artist[]>;
  getArtistBySlug(slug: string): Promise<Artist | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private artists: Map<number, Artist>;
  private bookings: Map<number, Booking>;
  private currentBookingId: number;

  constructor() {
    this.artists = new Map();
    this.bookings = new Map();
    this.currentBookingId = 1;

    // Initialize with static data
    artistsData.forEach(artist => {
      this.artists.set(artist.id, artist);
    });
  }

  async getAllArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtistBySlug(slug: string): Promise<Artist | undefined> {
    return Array.from(this.artists.values()).find(
      (artist) => artist.slug === slug
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = {
      id,
      name: insertBooking.name,
      email: insertBooking.email,
      artistId: insertBooking.artistId,
      message: insertBooking.message,
      date: insertBooking.date
    };
    this.bookings.set(id, booking);
    return booking;
  }
}

export const storage = new MemStorage();