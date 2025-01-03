import styles from "./flip-card.module.css";
import Filp from "@/app/components/icons/flip";
import { useLaptop } from "@/app/context/laptop";
import Trade from "./trade";

export default function FlipCard({ data, show, onHide, onSuccess }: any) {
  const { updateInfo } = useLaptop();
  return (
    <div className={`${styles.Container}`}>
      <img
        className={styles.Img}
        src={data.tokenImg || "/img/token-placeholder.png"}
      />
      <div className={styles.Bg} />
      <div className={styles.Content}>
        <div style={{ marginBottom: 30, marginLeft: 20 }}>
          <Filp />
        </div>
        <Trade
          modalShow={show}
          token={data}
          panelStyle={{
            backgroundColor: "transparent",
            padding: "0px 15px"
          }}
          onClose={() => {
            onHide && onHide();
          }}
          onSuccess={() => {
            onSuccess && onSuccess();
          }}
        />
      </div>
    </div>
  );
}
