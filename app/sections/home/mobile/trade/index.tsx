import styles from "./index.module.css";
import { simplifyNum } from "@/app/utils";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";
import { motion } from "framer-motion";

const COLORS = ["#C9FF5D", "#4305FE", "#FE05D9"];
const DIFF = 90;

export default function Trade({ token, isCurrent, onClick }: any) {
  const mc = useMcWithPump(token);
  return (
    <div className={`${styles.Container}`} onClick={onClick}>
      {token.bondingProgress !== 100 ? (
        <div>
          <div className={styles.McWrapper}>
            <div className={styles.McBox}>
              <div
                className={styles.Mc}
                style={{
                  color: token.isUp ? "#C9FF5D" : "#FF2681"
                }}
              >
                ${Number(mc) > 0 ? simplifyNum(Number(mc), 2) : "-"}
              </div>
              <div>MC</div>
            </div>
            <div>{token.bondingProgress}%</div>
          </div>
          <div className={styles.Progress}>
            <div
              className={styles.ProgressInner}
              style={{
                width: `${token.bondingProgress}%`
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <div>Market Cap</div>
          <div
            className={styles.Mc}
            style={{
              color: token.isUp ? "#C9FF5D" : "#FF2681"
            }}
          >
            ${Number(mc) > 0 ? simplifyNum(Number(mc), 2) : "-"}
          </div>
        </div>
      )}
      {isCurrent && (
        <motion.div
          key={token.id}
          initial={{
            rotateZ: 0,
            backgroundColor: COLORS[0]
          }}
          animate={{
            rotateZ: [0, -DIFF, DIFF, 0],
            backgroundColor: [COLORS[0], COLORS[2], COLORS[1], COLORS[0]]
          }}
          transition={{
            duration: 0.3,
            ease: "linear",
            repeat: 6
          }}
          onClick={onClick}
          className={`button ${styles.Button}`}
        >
          Trade
        </motion.div>
      )}
    </div>
  );
}
