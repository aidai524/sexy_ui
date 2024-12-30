import { motion } from "framer-motion";
import styles from "./laptop.module.css";
import options from "./options";
import { useEffect } from "react";

export default function Laptop({ open, onClose, onSelect }: any) {
  useEffect(() => {
    const close = () => {
      onClose();
    };

    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  }, []);
  return (
    open && (
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className={styles.Container}
        onClick={(ev) => {
          ev.stopPropagation();
          ev.nativeEvent.stopImmediatePropagation();
        }}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={styles.Item}
            onClick={() => {
              onSelect(option);
            }}
          >
            {option.label}
          </div>
        ))}
      </motion.div>
    )
  );
}
