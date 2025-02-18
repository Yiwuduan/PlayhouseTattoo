import { motion } from "framer-motion";
import PortfolioGallery from "./portfolio-gallery";

export default function Hero() {
  return (
    <div className="flex flex-col">
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-screen flex flex-col items-center justify-center text-center gap-8 pt-16"
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
          className="text-2xl md:text-4xl text-muted-foreground"
        >
          WE LOVE YOU
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-px h-32 bg-border mt-8"
        />
      </motion.section>

      <PortfolioGallery />
    </div>
  );
}