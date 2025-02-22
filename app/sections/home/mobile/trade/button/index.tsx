import styles from "./index.module.css";

import { motion } from "framer-motion";

const COLORS = ["#C9FF5D", "#4305FE", "#FE05D9"];
const DIFF = 90;

export default function TradeButton({ token, onClick }: any) {
  return (
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
        repeat: 30
      }}
      onClick={onClick}
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
          repeat: 6
        }}
        className={styles.Inner}
      >
        Trade
      </motion.div>
    </motion.div>
  );
}
