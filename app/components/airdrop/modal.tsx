import Modal from '@/app/components/modal';
import Index from './index';
import { useAirdrop } from '@/app/components/airdrop/hooks';
import { AirdropContext } from './context';
import AirdropConnectModal from '@/app/components/airdrop/connect/modal';
import AirdropMoreModal from '@/app/components/airdrop/more/modal';
import AirdropReferModal from '@/app/components/airdrop/refer/modal';
import AirdropClaimedModal from '@/app/components/airdrop/claimed/modal';
import AirdropShareModal from '@/app/components/airdrop/share/modal';

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
          top: 55,
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
      <AirdropClaimedModal
        visible={airdrop.claimPointsVisible}
        onClose={() => {
          airdrop.setClaimPointsVisible(false);
        }}
      />
      <AirdropShareModal
        visible={airdrop.shareImageVisible}
        onClose={() => {
          airdrop.setShareImageVisible(false);
        }}
      />
    </AirdropContext.Provider>
  );
};

export default AirdropModal;
