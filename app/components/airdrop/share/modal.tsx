import Modal from '@/app/components/modal';
import Index from './index';

const AirdropShareModal = (props: any) => {
  const { visible, onClose } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      mainStyle={{
        border: 0,
      }}
      closeStyle={{}}
      maskClose={false}
    >
      <Index {...props} />
    </Modal>
  );
};

export default AirdropShareModal;
