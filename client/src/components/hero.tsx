import { motion, useScroll, useTransform } from "framer-motion";
import PortfolioGallery from "./portfolio-gallery";
import { useEffect, useState } from "react";

export default function Hero() {
  const { scrollY } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Update scroll progress on scroll
  useEffect(() => {
    return scrollY.onChange((latest) => {
      // Calculate progress based on viewport height
      const progress = Math.min(latest / (window.innerHeight * 0.5), 1);
      setScrollProgress(progress);
    });
  }, [scrollY]);

  // Calculate colors based on scroll progress
  const color = useTransform(
    scrollY,
    [0, window.innerHeight * 0.25, window.innerHeight * 0.5],
    [
      "rgb(0, 0, 0)", // Black
      "rgb(255, 20, 147)", // Deep pink
      "rgb(135, 206, 235)", // Sky blue
    ]
  );

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-0"
    >
      <motion.h1 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        style={{ color }}
        className="text-6xl md:text-8xl font-bold tracking-tighter"
      >
        WELCOME BACK
      </motion.h1>

      <motion.p
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-4xl text-muted-foreground mb-16"
      >
        WE LOVE YOU
      </motion.p>

      <div className="absolute left-0 right-0 bottom-0 w-full">
        <PortfolioGallery />
      </div>
    </motion.section>
  );
}