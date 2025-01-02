import { AnimatePresence, motion } from "framer-motion";
import styles from "./index.module.css";

export default function PanelWrapper({ children, style = {} }: any) {
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
        style={style}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
