import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorWarp() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Create smooth spring animations for the cursor
  const springConfig = { damping: 25, stiffness: 700 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursorX.set(clientX - 25); // Center the cursor
      cursorY.set(clientY - 25);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
      }}
    >
      {/* Main cursor blob */}
      <motion.div
        className="absolute h-12 w-12 rounded-full bg-white/30 backdrop-blur-lg backdrop-invert"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Secondary distortion effect */}
      <motion.div
        className="absolute h-24 w-24 -translate-x-6 -translate-y-6 rounded-full bg-transparent backdrop-blur-md"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.div>
  );
}
