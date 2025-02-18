import { motion } from "framer-motion";
import { Link } from "wouter";
import { type Artist } from "@shared/schema";

interface ArtistGridProps {
  artists: Artist[];
}

export default function ArtistGrid({ artists }: ArtistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {artists.map((artist, i) => (
        <motion.div
          key={artist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link href={`/artists/${artist.slug}`}>
            <a className="group block">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={artist.portfolio[0]}
                  alt={artist.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold">{artist.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {artist.specialties.join(" • ")}
                </p>
              </div>
            </a>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
