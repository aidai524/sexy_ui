import AirdropCard from '../components/card';
import { useReferStore } from '@/app/store/useRefer';
import { useContext, useEffect } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';

const AirdropRefer = (props: any) => {
  const { onClose } = props;

  const { getUserData, userData } = useContext(AirdropContext);

  const referStore = useReferStore();

  const handleRefer = () => {
    referStore.setVisible(true, true);
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  useEffect(() => {
    getUserData?.();
  }, []);

  return (
    <AirdropCard title="">
      <div
        style={{
          color: '#FF2681',
          textAlign: 'center',
          fontFamily: 'Unbounded',
          fontSize: '14px',
          fontWeight: 300,
          marginTop: 60,
          padding: '0 16px',
        }}
      >
        You are not a user of Pump.fun, so there are no Airdrop campaign rewards.
      </div>
      <div
        style={{
          color: '#000',
          textAlign: 'center',
          fontFamily: 'Unbounded',
          fontSize: 16,
          fontWeight: 400,
          marginTop: 30,
        }}
      >
        Want to earn points?
      </div>
      <div
        style={{
          color: '#9290B1',
          textAlign: 'center',
          fontFamily: 'Unbounded',
          fontSize: 12,
          fontWeight: 300,
          marginTop: 10,
        }}
      >
        Invite Friends and Earn Points Get up to <strong
        style={{
          color: '#C926FF',
          fontSize: 14,
          fontWeight: 600
        }}
      >1M</strong>
      </div>
      <button
        type="button"
        style={{
          width: '100%',
          marginTop: 30,
          height: 60,
          color: "#FFF",
          textAlign: "center",
          fontFamily: "Unbounded",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
          padding: "0 65px",
          borderRadius: "30px",
          background: "#C926FF",
        }}
        onClick={handleRefer}
      >
        Refer
      </button>
      <button
        type="button"
        style={{
          width: '100%',
          marginTop: 0,
          height: 60,
          color: "#898989",
          textAlign: "center",
          fontFamily: "Unbounded",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          padding: "0 65px",
          borderRadius: "30px",
          background: "#FFF",
        }}
        onClick={handleCancel}
      >
        No, Thanks
      </button>
    </AirdropCard>
  );
};

export default AirdropRefer;
