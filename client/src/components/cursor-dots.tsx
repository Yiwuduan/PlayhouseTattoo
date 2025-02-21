import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export default function CursorDots() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

  // Smooth cursor movement using springs
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <>
      {/* Main distortion lens */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
        <div 
          className="relative w-[150px] h-[150px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.03) 100%)",
            backdropFilter: "blur(8px) contrast(150%) hue-rotate(10deg)",
            WebkitBackdropFilter: "blur(8px) contrast(150%) hue-rotate(10deg)",
          }}
        />
      </motion.div>

      {/* Small cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-50 w-3 h-3 bg-white rounded-full mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />
    </>
  );
}