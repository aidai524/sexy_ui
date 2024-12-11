import Likes from "@/app/components/thumbnail/likes";
import TokenCardActions from "../token-card-actions";
import styles from "./index.module.css";

export default function TokenCard({ token }: any) {
  return token ? (
    <div className={styles.Container}>
      <TokenCardActions />
      <img className={styles.Img} src={token.tokenImg} />
      <div className={styles.Like}>
        <Likes data={token} />
      </div>
    </div>
  ) : null;
}
