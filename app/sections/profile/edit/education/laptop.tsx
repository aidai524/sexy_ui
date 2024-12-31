import { motion } from "framer-motion";
import styles from "./laptop.module.css";
import options from "./options";
import { useEffect } from "react";

export default function Laptop({ open, onClose, onSelect }: any) {
  useEffect(() => {
    const close = () => {
      onClose();
    };

    document.body.addEventListener("click", close);

    return () => {
      document.body.removeEventListener("click", close);
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
