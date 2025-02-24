import { useState } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import styles from "./index.module.css";

import { motion } from "framer-motion";

const COLORS = ["#C9FF5D", "#4305FE", "#FE05D9"];
const DIFF = 90;

export default function TradeButton({ token, onClick }: any) {
  const { isMobile } = useUserAgent();
  const [isEnter, setIsEnter] = useState(isMobile);
  return isEnter ? (
    <motion.div
      key={token.id}
      initial={{
        rotateZ: 0
      }}
      animate={{
        rotateZ: [0, -DIFF, DIFF, 0]
      }}
      transition={{
        duration: 0.1,
        ease: "linear",
        repeat: isMobile ? 30 : Infinity
      }}
      onClick={onClick}
      onMouseLeave={() => {
        setIsEnter(false);
      }}
      className={`button ${styles.Button}`}
    >
      <motion.div
        initial={{
          backgroundColor: COLORS[0]
        }}
        animate={{
          backgroundColor: [COLORS[0], COLORS[2], COLORS[1], COLORS[0]]
        }}
        transition={{
          duration: 0.5,
          ease: "linear",
          repeat: isMobile ? 6 : Infinity
        }}
        className={styles.Inner}
      >
        Trade
      </motion.div>
    </motion.div>
  ) : (
    <button
      className={`button ${styles.Button}`}
      style={{ backgroundColor: COLORS[0] }}
      onMouseEnter={() => {
        setIsEnter(true);
      }}
    >
      Trade
    </button>
  );
}
