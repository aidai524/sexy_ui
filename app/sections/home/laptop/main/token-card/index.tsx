import Thumbnail from "@/app/components/thumbnail";
import TokenCardActions from "../token-card-actions";
import styles from "./index.module.css";

export default function TokenCard({ token }: any) {
  return token ? (
    <div className={styles.Container}>
      <TokenCardActions token={token} />
      <Thumbnail
        showProgress={false}
        showDesc={true}
        data={token}
        autoHeight={true}
        showTags={false}
        style={{
          height: 620,
          margin: 0
        }}
      />
    </div>
  ) : null;
}
