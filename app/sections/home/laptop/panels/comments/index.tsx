import Content from "../../../mobile/comments/content";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import { useUserAgent } from "@/app/context/user-agent";

export default function CommentsPanel({ token, onClose, onSuccess }: any) {
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
      <Content
        from="panel"
        id={token.id}
        onClose={onClose}
        total={token.comment}
        onSuccess={onSuccess}
      />
    </motion.div>
  );
}
