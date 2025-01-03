import Modal from '@/app/components/modal';
import Index from './index';

const AirdropMoreModal = (props: any) => {
  const { visible, onClose } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      mainStyle={{
        border: 0,
      }}
      closeStyle={{
        color: '#fff',
      }}
      maskClose={false}
    >
      <Index {...props} />
    </Modal>
  );
};

export default AirdropMoreModal;
