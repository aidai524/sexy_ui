import styles from "./index.module.css";
import { motion } from "framer-motion";
import { useTrends } from "@/app/sections/trends/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function King() {
  const { top1 } = useTrends({ isPolling: true });
  const router = useRouter();
  const [top1Shown, setTop1Shown] = useState<any>();

  useEffect(() => {
    setTop1Shown(void 0);
    if (!top1) {
      return;
    }
    let timer1: any;
    timer1 = setTimeout(() => {
      clearTimeout(timer1);
      setTop1Shown(top1);
    }, 300);

    return () => {
      clearTimeout(timer1);
    };
  }, [top1]);

  return (
    top1Shown && (
      <motion.div
        initial={{
          x: 98
        }}
        animate={{
          x: 10
        }}
        className={styles.Container}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 1
        }}
      >
        <div
          className={styles.Inner}
        >
          <div
            className={`${styles.Avatar} button`}
            style={{ backgroundImage: `url("${top1Shown.Icon}")` }}
            onClick={() => {
              router.push(`/detail?address=${top1Shown.address}`);
            }}
          >
            <img
              src="/img/trends/crown-laptop.svg"
              alt=""
              className={styles.Crown}
            />
          </div>
          <div>
            <div className={styles.Label}>King of hill</div>
            <div className={styles.Value}>{top1Shown.token_name}</div>
          </div>
        </div>
      </motion.div>
    )
  );
}
