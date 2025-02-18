import { motion } from "framer-motion";
import Hero from "@/components/hero";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Artist } from "@shared/schema";
import ArtistGrid from "@/components/artist-grid";
import Chatbot from "@/components/chatbot";

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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <ArtistGrid artists={artists?.slice(0, 3) || []} />
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Have Questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our AI assistant is here to help you with any questions about tattoos, 
            aftercare, or the tattooing process.
          </p>
        </div>
        <Chatbot />
      </motion.section>
    </div>
  );
}
