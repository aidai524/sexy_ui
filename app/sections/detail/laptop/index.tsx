import Token from "../../home/laptop/main/token";
import Back from "@/app/components/back/laptop";
import { motion } from "framer-motion";
import styles from "./index.module.css";

export default function Laptop({ infoData, isLoading }: any) {
  return (
    <motion.div
      className={styles.Container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Token infoData2={infoData} from="detail" isLoading={isLoading} />
      <div className={styles.BackWrapper}>
        <Back />
      </div>
    </motion.div>
  );
}
