import Modal from '@/app/components/modal';
import Index from './index';
import { useUserAgent } from '@/app/context/user-agent';
const CopyTradeShareModal = (props: any) => {
  const { visible, onClose, copyTradersUserInfo, reqAddress } = props;
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
      open={visible}
      onClose={onClose}
      {...modalConfig}
    >
      <Index {...props} copyTradersUserInfo={copyTradersUserInfo} reqAddress={reqAddress} />
    </Modal>
  );
};

export default CopyTradeShareModal;
