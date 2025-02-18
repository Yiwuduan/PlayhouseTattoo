import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Artist, PortfolioItem } from "@shared/schema";

export default function PortfolioGallery() {
  const { data: artists } = useQuery<(Artist & { portfolioItems: PortfolioItem[] })[]>({
    queryKey: ['/api/artists']
  });

  // Combine all portfolio images into a single array of portfolio items
  const allPortfolioItems = artists?.flatMap(artist => artist.portfolioItems) || [];

  return (
    <div className="w-[100vw] relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] overflow-hidden">
      <motion.div 
        className="flex gap-8 py-8"
        initial={{ x: "0%" }}
        animate={{ 
          x: "-50%",
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear"
          }
        }}
      >
        {/* Double the images to create seamless loop */}
        {[...allPortfolioItems, ...allPortfolioItems].map((item: PortfolioItem, i: number) => (
          <motion.div
            key={`${item.id}-${i}`}
            className="shrink-0 aspect-square w-72 bg-muted overflow-hidden rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={item.imageUrl}
              alt={item.title || `Portfolio piece ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}