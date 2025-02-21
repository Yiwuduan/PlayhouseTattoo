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
  const DOT_SPACING = 30; // Adjusted for tighter honeycomb
  const ROW_HEIGHT = DOT_SPACING * Math.sqrt(3) / 2; // Height between rows for hexagonal pattern
  const ACTIVATION_DISTANCE = 80; // Increased to affect more dots

  // Initialize dots in honeycomb pattern
  useEffect(() => {
    const generateDots = () => {
      const newDots: Dot[] = [];
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Calculate number of rows and cols needed
      const rows = Math.ceil(h / ROW_HEIGHT);
      const cols = Math.ceil(w / DOT_SPACING);

      // Generate honeycomb grid
      for (let row = 0; row < rows; row++) {
        const isOddRow = row % 2 === 1;
        // Offset every other row by half the spacing
        const xOffset = isOddRow ? DOT_SPACING / 2 : 0;

        for (let col = 0; col < cols; col++) {
          const x = col * DOT_SPACING + xOffset;
          const y = row * ROW_HEIGHT;

          // Only add dots within the viewport (with padding)
          if (x > 0 && x < w - DOT_SPACING && y > 0 && y < h - ROW_HEIGHT) {
            newDots.push({
              x,
              y,
              id: `${x}-${y}`,
            });
          }
        }
      }
      setDots(newDots);
    };

    generateDots();

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
          ? 1 + (1 - distance / ACTIVATION_DISTANCE) 
          : 1;
        const opacity = distance < ACTIVATION_DISTANCE
          ? (1 - distance / ACTIVATION_DISTANCE) * 0.6
          : 0;

        return (
          <motion.div
            key={dot.id}
            className="absolute w-[3px] h-[3px] bg-foreground/50 rounded-full" // Slightly larger dots
            style={{
              left: dot.x,
              top: dot.y,
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