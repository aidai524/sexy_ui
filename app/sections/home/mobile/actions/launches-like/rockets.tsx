import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Heart from "./rocket-icon";

export default function Rockets() {
  const [rockets, setRockets] = useState<any>([]);

  useEffect(() => {
    let timer: any = null;
    let count = 0;
    const loop = () => {
      timer = setTimeout(() => {
        setRockets((prev: any) => [...prev, { id: Date.now() }]);
        count++;

        if (count < 5) {
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
      {rockets.map((rocket: any, i: number) => (
        <motion.div
          key={rocket.id}
          initial={{ scale: 1, opacity: 1, y: 50, x: ((i % 3) - 1) * 15 }}
          animate={{ scale: 0.6, opacity: 0, y: -100 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ position: "absolute" }}
        >
          <Heart />
        </motion.div>
      ))}
    </div>
  );
}
