import Thumbnail from "@/app/components/thumbnail";
import styles from "./index.module.css";

export default function TokenCard({ token }: any) {
  return token ? (
    <div className={styles.Container}>
      <Thumbnail
        showProgress={true}
        showDesc={true}
        data={token}
        autoHeight={true}
        showTags={false}
        showDropdownIcon={false}
        style={{
          height: "100%",
          margin: 0
        }}
      />
    </div>
  ) : null;
}
