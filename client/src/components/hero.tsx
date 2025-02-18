import { motion } from "framer-motion";
import PortfolioGallery from "./portfolio-gallery";

export default function Hero() {
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