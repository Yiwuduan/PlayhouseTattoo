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
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="relative w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)",
            backdropFilter: "blur(20px) contrast(200%) hue-rotate(45deg) brightness(1.3)",
            WebkitBackdropFilter: "blur(20px) contrast(200%) hue-rotate(45deg) brightness(1.3)",
            mixBlendMode: "difference"
          }}
        />
      </motion.div>

      {/* Small cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-6 h-6 bg-white rounded-full mix-blend-difference"
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