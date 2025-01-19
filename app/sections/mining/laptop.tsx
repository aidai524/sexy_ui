import { AnimatePresence, motion } from "framer-motion";
import styles from "./laptop.module.css";
import TotalPanel from "./mobile/total-panel";
import EarnAndInvite from "./mobile/earn-invite";
import Others from "./mobile/others";
import RankPanel from "./component/rank";

export default function Laptop({ info, infoLoading }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.Wrapper}
    >
      <div className={styles.TitleWrapper}>Reward</div>
      <div className={styles.Container}>
        <div className={styles.Content}>
          <TotalPanel info={info} />
          <div style={{ height: 20 }} />
          <EarnAndInvite info={info} />
          <div style={{ height: 36 }} />
          <Others info={info} />
        </div>
      </div>
      <AnimatePresence mode="wait">
        {info?.mining_rank && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            className={styles.RankWrapper}
          >
            <RankPanel
              rank={info?.your_rank}
              list={info?.mining_rank}
              loading={infoLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
