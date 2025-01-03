import Modal from '@/app/components/modal';
import Index from './index';
import { useAirdrop } from '@/app/components/airdrop/hooks';
import { AirdropContext } from './context';
import AirdropConnectModal from '@/app/components/airdrop/connect/modal';
import AirdropMoreModal from '@/app/components/airdrop/more/modal';

const AirdropModal = (props: any) => {
  const { visible, onClose } = props;

  const airdrop = useAirdrop(props);

  return (
    <AirdropContext.Provider value={{ ...airdrop }}>
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
      <AirdropConnectModal
        visible={airdrop.connectVisible}
        onClose={() => {
          airdrop.setConnectVisible(false);
        }}
      />
      <AirdropMoreModal
        visible={airdrop.morePointsVisible}
        onClose={() => {
          airdrop.setMorePointsVisible(false);
        }}
      />
    </AirdropContext.Provider>
  );
};

export default AirdropModal;
