import styles from "./tips.module.css";
import SimpleAvatar from "../../avatar/simple";

const TYPES: Record<string, any> = {
  Flipped: {
    color: "#FBCA04",
    bg: "#FBCA0433"
  },
  Bought: {
    color: "#C9FF5D",
    bg: "#C9FF5D33"
  },
  Sold: {
    color: "#FF2681",
    bg: "#FE05D933"
  }
};
export default function Tips({ type = "Flipped" }: any) {
  return (
    <div
      className={styles.Container}
      style={{ backgroundColor: TYPES[type].bg }}
    >
      <div
        className={styles.Type}
        style={{ backgroundColor: TYPES[type].color }}
      >
        <SimpleAvatar icon={""} size={16} />
        <div>{type}</div>
      </div>
      <div className={styles.Token}>
        <div>2.3 SOL </div>
        <img
          src={
            "https://flipn.s3.us-east-1.amazonaws.com/flipn/stg/JgoRUe8HR3Skull You.webp"
          }
          className={styles.TokenIcon}
        />
        <div className={styles.TokenName}>LEMONPE... </div>
      </div>
    </div>
  );
}
