import Token from "../../home/laptop/main/token";
import Back from "@/app/components/back/laptop";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import useTokenDetail from "../use-token-detail";

export default function Laptop(props: any) {
  const { from } = props ?? {};
  const { infoData, isLoading } = useTokenDetail({});

  return (
    <motion.div
      className={styles.Container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Token infoData2={infoData} from="detail" isLoading={isLoading} />
      <div className={styles.BackWrapper}>
        <Back from={from || "detail"} />
      </div>
    </motion.div>
  );
}
