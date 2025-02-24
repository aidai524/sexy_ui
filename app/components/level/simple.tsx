import styles from "./simple.module.css";
import { getCurrentLevel } from "@/app/config";

const LevelColor: any = {
  "1": "rgba(255, 255, 255, 0.5)",
  "2": "#2AFEB4",
  "3": "#31adb6",
  "4": "#2A9FFE",
  "5": "#3300ff",
  "6": "#A65DFF",
}

export default function Simple({ level }: any) {
  const _level = level || 1;
  const currentLevel = getCurrentLevel(_level);
  return (
    <div
      className={`${styles.Label} ${level > 3 ? styles.Upper : styles.Normal}`}
      style={{
        color: LevelColor[level]
      }}
    >
      Lv.{_level}
    </div>
  );
}
