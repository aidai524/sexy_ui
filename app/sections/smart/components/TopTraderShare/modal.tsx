import Modal from '@/app/components/modal';
import Index from './index';

const TopTraderShareModal = (props: any) => {
  const { show, onClose, selectedItems } = props;

  return (
    <Modal
      open={show}
      onClose={onClose}
      animation="popup"
      closeStyle={{ display: "none" }}
    >
      <Index {...props} />
    </Modal>
  );
};

export default TopTraderShareModal;
