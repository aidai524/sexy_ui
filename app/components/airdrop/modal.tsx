import Modal from '@/app/components/modal';
import Index from './index';
import { useAirdrop } from '@/app/components/airdrop/hooks';
import { AirdropContext } from './context';
import AirdropConnectModal from '@/app/components/airdrop/connect/modal';
import AirdropMoreModal from '@/app/components/airdrop/more/modal';
import AirdropReferModal from '@/app/components/airdrop/refer/modal';

const AirdropModal = (props: any) => {
  const airdrop = useAirdrop();

  return (
    <AirdropContext.Provider value={{ ...airdrop }}>
      <Modal
        open={airdrop.airdropVisible}
        onClose={airdrop.onClose}
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
      <AirdropReferModal
        visible={airdrop.referVisible}
        onClose={() => {
          airdrop.setReferVisible(false);
        }}
      />
    </AirdropContext.Provider>
  );
};

export default AirdropModal;
