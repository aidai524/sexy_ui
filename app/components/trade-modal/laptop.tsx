import Content from "./content";
import ModalClose from "@/app/components/icons/modal-close";
import { AnimatePresence, motion } from "framer-motion";
import ReactDOM from "react-dom";
import styles from "./laptop.module.css";
import { useUserAgent } from "@/app/context/user-agent";

export default function Laptop({ show, ...rest }: any) {
  const { innerHeight } = useUserAgent();
  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {show && (
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
            <div />
            <button className="button" onClick={rest.onClose}>
              <ModalClose size={34} />
            </button>
          </div>
          <div className={styles.Content}>
            <Content {...rest} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
