import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Artist } from "@shared/schema";

export default function PortfolioGallery() {
  const { data: artists } = useQuery<Artist[]>({
    queryKey: ['/api/artists']
  });

  // Combine all portfolio images into a single array
  const allImages = artists?.flatMap(artist => artist.portfolio) || [];

  return (
    <div className="w-[100vw] relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] overflow-hidden">
      <motion.div 
        className="flex gap-4"
        initial={{ x: 0 }}
        animate={{ 
          x: [0, -1000],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear"
            }
          }
        }}
      >
        {/* Double the images to create seamless loop */}
        {[...allImages, ...allImages].map((image, i) => (
          <motion.div
            key={i}
            className="shrink-0 aspect-square w-64 bg-muted overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={image}
              alt={`Portfolio piece ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}