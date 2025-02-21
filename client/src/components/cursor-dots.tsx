import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export default function CursorDots() {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  //console.log("Mouse position:", mousePosition); // Debug log removed

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
    <div className="custom-cursor">
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
      <motion.div
        className="cursor-outline"
        style={{
          x: cursorX,
          y: cursorY,
          transition: {
            type: "spring",
            damping: 15,
            stiffness: 150,
          },
        }}
      />
    </div>
  );
}