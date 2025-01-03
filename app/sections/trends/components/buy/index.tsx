import TradeModal from '@/app/components/trade-modal';

const BuyModal = (props: Omit<Props, 'isMobile'>) => {
  const { visible, tradeToken, onClose } = props;

  return (
    <TradeModal
      show={visible}
      onClose={onClose}
      data={tradeToken}
      initType={"buy"}
    />
  );
};

export default BuyModal;

interface Props {
  visible?: boolean;
  isMobile?: boolean;
  tradeToken?: any;

  onClose?(): void;
}
