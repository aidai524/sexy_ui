import styles from "./with-flip.module.css";
import Thumbnail from ".";
import FlipCard from "../smokHot/flip-card";
import { useFlip } from "@/app/context/flip";
export default function WithFlip(props: any) {
  const { style, data } = props;
  const { onChangeFlip, params, isFlip } = useFlip();

  return (
    <div className={styles.Card} style={style}>
      <div className={`${styles.Inner} ${isFlip && styles.InnerFlip}`}>
        <div
          className={`${styles.Face}`}
          style={{
            zIndex: isFlip ? 8 : 6
          }}
        >
          <Thumbnail {...props} />
        </div>
        <div
          className={`${styles.Face} ${styles.Back}`}
          style={{
            zIndex: isFlip ? 8 : 6
          }}
        >
          <FlipCard
            data={data}
            show={true}
            onHide={() => {
              onChangeFlip(false, {});
            }}
            onSuccess={() => {
              onChangeFlip(false, {});
              params?.onSuccess?.();
            }}
          />
        </div>
      </div>
    </div>
  );
}
