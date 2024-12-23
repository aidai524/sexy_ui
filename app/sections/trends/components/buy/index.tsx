import styles from './index.module.css';
import { Popup } from 'antd-mobile';
import Trade from '@/app/components/trade';

const BuyModal = (props: Props) => {
  const { visible, tradeToken, onClose } = props;

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      {
        visible && (
          <div className={styles.BuyContent}>
            <div
              className={styles.BuyContentLogo}
              style={{ backgroundImage: `url("${tradeToken?.tokenUri}")` }}
            >
              {
                tradeToken?.tickerAvatar && (
                  <div
                    className={styles.BuyContentTickerAvatar}
                    style={{ backgroundImage: `url("${tradeToken?.tickerAvatar}")` }}
                  />
                )
              }
            </div>
            <div className={styles.BuyContentInfo}>
              {tradeToken?.tokenSymbol} / Ticker: {tradeToken?.ticker}
            </div>
            <Trade
              token={tradeToken}
              initType="buy"
              from="mobile"
            />
          </div>
        )
      }
    </Popup>
  );
};

export default BuyModal;

interface Props {
  visible?: boolean;
  tradeToken?: any;
  onClose?(): void;
}
