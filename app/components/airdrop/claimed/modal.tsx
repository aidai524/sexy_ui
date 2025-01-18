import Modal from '@/app/components/modal';
import Index from './index';
import { useContext } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';

const AirdropClaimedModal = (props: any) => {
  const { visible, onClose } = props;

  const { onClose: onAirdropClose } = useContext(AirdropContext);

  const handleClose = () => {
    onClose?.();
    onAirdropClose?.();
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      mainStyle={{
        border: 0,
      }}
      closeStyle={{
        top: 55,
      }}
      maskClose={false}
    >
      <Index {...props} onClose={handleClose} />
    </Modal>
  );
};

export default AirdropClaimedModal;
