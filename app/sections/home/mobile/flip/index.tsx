import styles from "./index.module.css";
import HomeIcon from "@/app/components/icons/home";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUserAgent } from "@/app/context/user-agent";

const COLORS = ["#FBCA04", "#04FB1D", "#FE05D9"];

export default function Flip({ token, id, onClick }: any) {
  const { isMobile } = useUserAgent();
  const [isEnter, setIsEnter] = useState(isMobile);
  if (token.account === window.sexAddress) {
    return null;
  }

  return isEnter ? (
    <motion.div
      key={id}
      className={styles.Container}
      initial={{
        rotateZ: 0,
        backgroundColor: COLORS[0]
      }}
      animate={{
        rotateZ: [0, -5, 5, 0],
        backgroundColor: [COLORS[0], COLORS[1], COLORS[2], COLORS[0]]
      }}
      transition={{
        duration: 0.1,
        ease: "linear",
        repeat: 30
      }}
      onClick={onClick}
      onMouseLeave={() => {
        setIsEnter(false);
      }}
    >
      <HomeIcon size={28} type="black" />
      <div>Flip it!</div>
    </motion.div>
  ) : (
    <button
      className={`button ${styles.Container}`}
      style={{ backgroundColor: COLORS[0] }}
      onMouseEnter={() => {
        setIsEnter(true);
      }}
    >
      <HomeIcon size={28} type="black" />
      <div>Flip it!</div>
    </button>
  );
}
