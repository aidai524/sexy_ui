import styles from './index.module.css';
import { Popup } from 'antd-mobile';
import Trade from '@/app/components/trade';
import { useUserAgent } from '@/app/context/user-agent';
import Modal from '@/app/components/modal';

const BuyModal = (props: Omit<Props, 'isMobile'>) => {
  const { visible, tradeToken, onClose } = props;

  const { isMobile } = useUserAgent();

  return isMobile ? (
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
      <Content {...props} isMobile={isMobile} />
    </Popup>
  ) : (
    <Modal
      open={visible}
      onClose={onClose}
      mainStyle={{
        background: 'unset',
        border: 0,
      }}
    >
      <Content {...props} isMobile={isMobile} />
    </Modal>
  );
};

const Content = (props: Props) => {
  const { visible, tradeToken, isMobile } = props;

  return visible && (
    <div className={styles.BuyContent}>
      {
        isMobile && (
          <div
            className={styles.BuyContentLogo}
            style={{ backgroundImage: `url("${tradeToken?.tokenIcon}")` }}
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
        )
      }
      <div className={styles.BuyContentInfo}>
        {tradeToken?.tokenSymbol} / Ticker: {tradeToken?.ticker}
      </div>
      <Trade
        token={tradeToken}
        initType="buy"
        from="mobile"
      />
    </div>
  );
};

export default BuyModal;

interface Props {
  visible?: boolean;
  isMobile?: boolean;
  tradeToken?: any;

  onClose?(): void;
}
