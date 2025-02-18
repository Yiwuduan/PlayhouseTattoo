import { motion } from "framer-motion";
import Hero from "@/components/hero";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Artist } from "@shared/schema";
import ArtistGrid from "@/components/artist-grid";
import MapSection from "@/components/map-section";

export default function Home() {
  const { data: artists, isLoading } = useQuery<Artist[]>({ 
    queryKey: ['/api/artists']
  });

  return (
    <div className="flex flex-col gap-24">
      <Hero />

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">OUR ARTISTS</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <ArtistGrid artists={artists || []} />
            <Button asChild className="mt-12" size="lg">
              <Link href="/artists">
                View All Artists
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">FIND US</h2>
        <MapSection />
      </motion.section>
    </div>
  );
}