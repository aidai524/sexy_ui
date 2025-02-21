import styles from "./index.module.css";
import HomeIcon from "@/app/components/icons/home";
import { motion } from "framer-motion";

const COLORS = ["#FBCA04", "#04FB1D", "#FE05D9"];

export default function Flip({ token, id, onClick }: any) {
  if (token.account === window.sexAddress) {
    return null;
  }

  return (
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
        duration: 0.3,
        ease: "linear",
        repeat: 10
      }}
      onClick={onClick}
    >
      <HomeIcon size={28} type="black" />
      <div>Flip it!</div>
    </motion.div>
  );
}
