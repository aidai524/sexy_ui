import styles from './index.module.css';
import { SOL } from '@/app/components/trade/buySellPump';
import { DotLoading } from 'antd-mobile';

const TokenClaimCard = (props: any) => {
  const { type = 'claim', tokenIcon, list, theme = 'green', warning, title, onSubmit, loading } = props;

  return (
    <div className={styles.ClaimCard}>
      <div
        className={styles.ClaimHeader}
        style={{
          flexDirection: type === 'claim' ? 'row' : 'row-reverse',
        }}
      >
        <img className={styles.ClaimTokenIcon} src={SOL.tokenUri} alt="" width={36} height={36} />
        <img src="/img/profile/icon-arrow-to-right.svg" alt="" width={48} height={16} />
        <img className={styles.ClaimTokenIconTo} src={tokenIcon} alt="" width={36} height={36} />
      </div>
      <div className={styles.ClaimCardTitle}>
        {title}
      </div>
      <ul className={styles.ClaimCardList}>
        {
          list.map((item: any, index: number) => (
            <li key={index} className={styles.ClaimCardItem}>
              <div className={styles.ClaimCardLabel}>
                {item.label}
              </div>
              <div className={styles.ClaimCardValue}>
                <div className={styles.ClaimCardValueText}>
                  {item.value}
                </div>
                <img className={styles.ClaimCardValueIcon} src={item.icon} alt="" />
              </div>
            </li>
          ))
        }
      </ul>
      <div className={styles.ClaimCardFooter}>
        <button
          type="button"
          className={theme === 'green' ? styles.ClaimCardButton : styles.ClaimCardButtonPrimary}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? <DotLoading /> : title}
        </button>
      </div>
      {
        !!warning && (
          <div className={styles.ClaimCardWarning}>
            <img
              className={styles.ClaimCardWarningIcon}
              src="/img/profile/icon-warning.svg"
              alt=""
              width={20}
              height={20}
            />
            <div className={styles.ClaimCardWarningText}>
              {warning}
            </div>
          </div>
        )
      }
    </div>
  );
};

export default TokenClaimCard;
