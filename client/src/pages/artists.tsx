import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Artist } from "@shared/schema";
import ArtistGrid from "@/components/artist-grid";

export default function Artists() {
  const { data: artists, isLoading } = useQuery<Artist[]>({
    queryKey: ['/api/artists']
  });

  return (
    <div className="pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">OUR ARTISTS</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet our talented team of artists, each bringing their unique style and expertise 
          to create exceptional tattoo art.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <ArtistGrid artists={artists || []} />
      )}
    </div>
  );
}
