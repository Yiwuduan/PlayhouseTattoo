import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import type { Artist, PortfolioItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CalendarIcon } from "lucide-react";

export default function Artist() {
  const { slug } = useParams();
  const { data: artist, isLoading } = useQuery<Artist & { portfolioItems: PortfolioItem[] }>({
    queryKey: [`/api/artists/${slug}`]
  });

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 animate-pulse">
        <div className="h-8 w-48 bg-muted mb-4" />
        <div className="h-4 w-96 bg-muted mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Artist Not Found</h1>
        <Link href="/artists">
          <a className="text-primary hover:underline">View All Artists</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          {artist.name}
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
          {artist.bio}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {artist.specialties.map((specialty) => (
            <span
              key={specialty}
              className="px-3 py-1 bg-muted text-sm rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
        <Button asChild size="lg">
          <Link href={`/book?artist=${artist.slug}`}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Book with {artist.name}
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {artist.portfolioItems.map((item: PortfolioItem, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="aspect-square bg-muted overflow-hidden"
          >
            <img
              src={item.imageUrl}
              alt={item.title || `${artist.name}'s work ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}