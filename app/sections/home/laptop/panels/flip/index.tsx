import ModalClose from "@/app/components/icons/modal-close";
import Image from "next/image";
import Trade from "@/app/components/smokHot/trade";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import { useUserAgent } from "@/app/context/user-agent";

export default function FlipPanel({ token, onClose, onSuccess }: any) {
  const { innerHeight } = useUserAgent();

  return (
    <motion.div
      initial={{ x: 375 }}
      exit={{ x: 375 }}
      animate={{ x: 0 }}
      transition={{
        ease: "linear",
        duration: 0.3
      }}
      className={styles.Container}
      style={{
        height: innerHeight
      }}
    >
      <div className={styles.Header}>
        <Image
          src="/img/titles/flip-title.png"
          width={120}
          height={73}
          alt="Flip"
        />
        <button className="button" onClick={onClose}>
          <ModalClose size={34} />
        </button>
      </div>
      <div className={styles.Content}>
        <Trade
          modalShow={true}
          token={token}
          onClose={onClose}
          onSuccess={onSuccess}
          mainStyle={{
            paddingTop: 30
          }}
          bottomStyle={{
            position: "absolute",
            left: 0,
            bottom: 27
          }}
        />
      </div>
    </motion.div>
  );
}
