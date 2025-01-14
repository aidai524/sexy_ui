import styles from "./index.module.css";
import { motion } from "framer-motion";
import { useTrends } from "@/app/sections/trends/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function King() {
  const { top1 } = useTrends({ isPolling: true });
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!top1) return;
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 2000);
  }, [top1]);

  return (
    top1 && (
      <motion.div
        initial={{
          x: show ? 98 : 2
        }}
        animate={{
          x: show ? 2 : 98
        }}
        className={styles.Container}
      >
        <div
          className={styles.Inner}
          onMouseEnter={() => {
            setShow(true);
          }}
          onMouseLeave={() => {
            setShow(false);
          }}
        >
          <div
            className={`${styles.Avatar} button`}
            style={{ backgroundImage: `url("${top1.Icon}")` }}
            onClick={() => {
              router.push(`/detail?address=${top1.address}`);
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
            <div className={styles.Value}>{top1.token_name}</div>
          </div>
        </div>
      </motion.div>
    )
  );
}
