import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Heart from "./heart-icon";

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<any>([]);

  useEffect(() => {
    let timer: any = null;
    let count = 0;
    const loop = () => {
      timer = setTimeout(() => {
        const r = Math.random() - 0.5;
        const x = r > 0 ? r * 100 : r * 200;
        const rotate = r > 0 ? "0deg" : "-45deg";
        setHearts((prev: any) => [...prev, { id: Date.now(), x, rotate }]);
        count++;

        if (count < 10) {
          loop();
        } else {
          clearTimeout(timer);
        }
      }, 500);
    };
    loop();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: -56,
        left: 0,
        width: 24,
        height: 20
      }}
    >
      {hearts.map((heart: any) => (
        <motion.div
          key={heart.id}
          initial={{ opacity: 1, y: 50, x: 0, rotate: heart.rotate }}
          animate={{ opacity: 0, y: -200, x: heart.x }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ position: "absolute" }}
        >
          <Heart />
        </motion.div>
      ))}
    </div>
  );
}
