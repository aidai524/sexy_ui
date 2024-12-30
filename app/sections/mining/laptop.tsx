import Back from "@/app/components/back/laptop";
import Content from "./content";
import { motion } from "framer-motion";
import styles from "./laptop.module.css";

export default function Laptop(props: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.Wrapper}
    >
      <div className={styles.Container}>
        <div className={styles.BackWrapper}>
          <Back />
        </div>
        <Content styles={styles} isMobile={false} {...props} />
      </div>
    </motion.div>
  );
}
