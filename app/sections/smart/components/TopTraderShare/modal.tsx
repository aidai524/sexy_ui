import Modal from '@/app/components/modal';
import Index from './index';

const CopyTradeShareModal = (props: any) => {
  const { visible, onClose, copyTradersUserInfo } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      animation="popup"
      closeStyle={{ display: "none" }}
    >
      <Index {...props} copyTradersUserInfo={copyTradersUserInfo} />
    </Modal>
  );
};

export default CopyTradeShareModal;
