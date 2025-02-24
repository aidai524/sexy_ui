import Modal from '@/app/components/modal';
import Index from './index';
import { useUserAgent } from '@/app/context/user-agent';

const TopTraderShareModal = (props: any) => {
  const { show, onClose, selectedItems, shareName } = props;
  const { isMobile } = useUserAgent();
  const modalConfig = isMobile ? {
    animation: 'popup',
    closeStyle: { display: "none" }
  } : {
    closeStyle:{ display: "none" },
    maskClose:false
  };
  return (
    <Modal
      open={show}
      onClose={onClose}
      {...modalConfig}
    >
      <Index {...props} />
    </Modal>
  );
};

export default TopTraderShareModal;
