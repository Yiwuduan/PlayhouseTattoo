import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export default function CursorDots() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  console.log("Mouse position:", mousePosition); // Debug log

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
      {/* Main cursor with debug styles */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* Debug background color to verify visibility */}
        <div 
          className="relative w-[300px] h-[300px] rounded-full"
          style={{
            backgroundColor: "rgba(255, 0, 0, 0.1)", // Debug color
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />
      </motion.div>

      {/* Small cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-6 h-6 bg-red-500 rounded-full"
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