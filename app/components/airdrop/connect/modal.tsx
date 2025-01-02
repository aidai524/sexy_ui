import Modal from '@/app/components/modal';
import Index from './index';

const AirdropConnectModal = (props: any) => {
  const { visible, onClose } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      mainStyle={{
        border: 0,
      }}
      closeStyle={{
        display: 'none',
      }}
    >
      <Index {...props} />
    </Modal>
  );
};

export default AirdropConnectModal;
