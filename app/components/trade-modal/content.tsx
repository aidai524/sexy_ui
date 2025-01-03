import Trade from "@/app/components/trade";
import { useUserAgent } from "@/app/context/user-agent";
import styles from "./content.module.css";

export default function Content({ onClose, data, initType, show }: any) {
  const { isMobile } = useUserAgent();
  return (
    <div>
      {isMobile && (
        <div>
          <div className={styles.avatar}>
            <img
              className={styles.avatarImg}
              src={data.tokenIcon || data.tokenImg || '/img/token-placeholder.png'}
            />
          </div>

          <div className={styles.nameContent}>
            <div className={styles.name}>{data.tokenName}</div>
            <div className={styles.ticker}>/Ticker:{data.ticker}</div>
          </div>
        </div>
      )}

      <Trade initType={initType} token={data} onClose={onClose} show={show} />
    </div>
  );
}
