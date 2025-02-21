import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { throttle } from "lodash";

interface Dot {
  x: number;
  y: number;
  id: string;
}

export default function CursorDots() {
  const [dots, setDots] = useState<Dot[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const DOT_SPACING = 35; 
  const ACTIVATION_DISTANCE = 60; 

  // Initialize dots grid
  useEffect(() => {
    const generateDots = () => {
      const newDots: Dot[] = [];
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Add padding to avoid dots at the very edge
      for (let x = DOT_SPACING; x < w - DOT_SPACING; x += DOT_SPACING) {
        for (let y = DOT_SPACING; y < h - DOT_SPACING; y += DOT_SPACING) {
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

    // Throttle resize handler
    const throttledResize = throttle(generateDots, 200);
    window.addEventListener('resize', throttledResize);
    return () => window.removeEventListener('resize', throttledResize);
  }, []);

  // Throttled mouse movement handler
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    }, 16), 
    []
  );

  // Track mouse position
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-1">
      {dots.map((dot) => {
        const distance = Math.sqrt(
          Math.pow(mousePos.x - dot.x, 2) + Math.pow(mousePos.y - dot.y, 2)
        );

        // Don't render dots that are too far from the cursor
        if (distance > ACTIVATION_DISTANCE * 1.2) {
          return null;
        }

        const scale = distance < ACTIVATION_DISTANCE
          ? 1 + (1 - distance / ACTIVATION_DISTANCE) * 0.8 
          : 1;
        const opacity = distance < ACTIVATION_DISTANCE
          ? (1 - distance / ACTIVATION_DISTANCE) * 0.5 
          : 0;

        return (
          <motion.div
            key={dot.id}
            className="absolute w-[2px] h-[2px] bg-foreground/60 rounded-full" 
            style={{
              left: dot.x,
              top: dot.y,
            }}
            animate={{
              scale,
              opacity,
            }}
            transition={{
              type: "tween", 
              duration: 0.15, 
            }}
          />
        );
      })}
    </div>
  );
}