import { motion } from "framer-motion";
import { Link } from "wouter";
import type { Artist, PortfolioItem } from "@shared/schema";

interface ArtistGridProps {
  artists: (Artist & { portfolioItems: PortfolioItem[] })[];
}

export default function ArtistGrid({ artists }: ArtistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {artists.map((artist, i) => (
        <motion.div
          key={artist.id}
          initial={{ 
            opacity: 0, 
            x: i % 2 === 0 ? -50 : 50, // Alternate between left and right
            y: 20 
          }}
          whileInView={{ 
            opacity: 1, 
            x: 0, 
            y: 0 
          }}
          viewport={{ 
            once: true,
            margin: "-100px"
          }}
          transition={{ 
            duration: 0.8,
            delay: i * 0.2, // Increased delay for more noticeable stagger
            type: "spring",
            damping: 20,
            stiffness: 100
          }}
        >
          <Link href={`/artists/${artist.slug}`}>
            <a className="group block">
              <div className="aspect-square overflow-hidden bg-muted">
                {artist.profileImage ? (
                  <img
                    src={`${artist.profileImage}?${Date.now()}`}
                    alt={artist.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                ) : artist.portfolioItems[0] ? (
                  <img
                    src={`${artist.portfolioItems[0].imageUrl}?${Date.now()}`}
                    alt={artist.portfolioItems[0].title || artist.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image available
                  </div>
                )}
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