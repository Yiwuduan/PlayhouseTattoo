import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Dot {
  x: number;
  y: number;
  id: string;
}

export default function CursorDots() {
  const [dots, setDots] = useState<Dot[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const DOT_SPACING = 25; // Reduced from 50 to make dots more dense
  const ACTIVATION_DISTANCE = 80; // Slightly reduced from 100 to maintain performance

  // Initialize dots grid
  useEffect(() => {
    const generateDots = () => {
      const newDots: Dot[] = [];
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (let x = 0; x < w; x += DOT_SPACING) {
        for (let y = 0; y < h; y += DOT_SPACING) {
          newDots.push({
            x,
            y,
            id: `${x}-${y}`,
          });
        }
      }
      setDots(newDots);
    };

    generateDots();

    // Regenerate dots on window resize
    window.addEventListener('resize', generateDots);
    return () => window.removeEventListener('resize', generateDots);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10"> {/* Added -z-10 to place behind content */}
      {dots.map((dot) => {
        const distance = Math.sqrt(
          Math.pow(mousePos.x - dot.x, 2) + Math.pow(mousePos.y - dot.y, 2)
        );
        const scale = distance < ACTIVATION_DISTANCE
          ? 1 + (1 - distance / ACTIVATION_DISTANCE) * 1
          : 1;
        const opacity = distance < ACTIVATION_DISTANCE
          ? (1 - distance / ACTIVATION_DISTANCE) * 0.5 // Reduced max opacity to 0.5
          : 0;

        return (
          <motion.div
            key={dot.id}
            className="absolute w-1 h-1 bg-foreground rounded-full"
            style={{
              left: dot.x,
              top: dot.y,
              scale,
              opacity,
            }}
            animate={{
              scale,
              opacity,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          />
        );
      })}
    </div>
  );
}