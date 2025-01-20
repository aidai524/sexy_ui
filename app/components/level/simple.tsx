import styles from "./simple.module.css";
import { getCurrentLevel } from "@/app/config";

export default function Simple({ level }: any) {
  const _level = level || 1;
  const currentLevel = getCurrentLevel(_level);
  return (
    <div
      className={`${styles.Label} ${level > 3 ? styles.Upper : styles.Normal}`}
      style={{
        backgroundImage: currentLevel.theme
      }}
    >
      Lv.{_level}
    </div>
  );
}
