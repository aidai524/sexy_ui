import { AnimatePresence, motion } from "framer-motion";
import styles from "./index.module.css";

export default function PanelWrapper({ children }: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={{
          visible: {
            y: 0
          },
          hidden: {
            y: 10
          }
        }}
        initial="hidden"
        exit="hidden"
        animate="visible"
        className={styles.PanelWrapper}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
