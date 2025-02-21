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
  const DOT_SPACING = 15; // Reduced from 30
  const ROW_HEIGHT = DOT_SPACING * Math.sqrt(3) / 2;
  const ACTIVATION_DISTANCE = 40; // Reduced from 80

  // Initialize dots in honeycomb pattern
  const generateDots = useCallback(() => {
    const newDots: Dot[] = [];
    const w = window.innerWidth;
    const h = window.innerHeight;

    const rows = Math.ceil(h / ROW_HEIGHT);
    const cols = Math.ceil(w / DOT_SPACING);

    for (let row = 0; row < rows; row++) {
      const isOddRow = row % 2 === 1;
      const xOffset = isOddRow ? DOT_SPACING / 2 : 0;

      for (let col = 0; col < cols; col++) {
        const x = col * DOT_SPACING + xOffset;
        const y = row * ROW_HEIGHT;

        if (x >= 0 && x <= w && y >= 0 && y <= h) {
          newDots.push({
            x,
            y,
            id: `${row}-${col}`,
          });
        }
      }
    }
    setDots(newDots);
  }, []);

  useEffect(() => {
    generateDots();
    const throttledResize = throttle(generateDots, 200);
    window.addEventListener('resize', throttledResize);

    return () => {
      window.removeEventListener('resize', throttledResize);
      throttledResize.cancel();
    };
  }, [generateDots]);

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    }, 16),
    []
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      handleMouseMove.cancel();
    };
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-1">
      {dots.map((dot) => {
        const distance = Math.sqrt(
          Math.pow(mousePos.x - dot.x, 2) + Math.pow(mousePos.y - dot.y, 2)
        );

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
            className="absolute w-[3px] h-[3px] bg-foreground/50 rounded-full"
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