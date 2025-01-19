import AirdropCard from '../components/card';
import { useReferStore } from '@/app/store/useRefer';
import { useContext, useEffect } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';

const AirdropRefer = (props: any) => {
  const { onClose } = props;

  const { getUserData, setShareImageVisible } = useContext(AirdropContext);

  const referStore = useReferStore();

  const handleRefer = () => {
    // referStore.setVisible(true, true);
    setShareImageVisible?.(true);
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
          color: '#FBCA04',
          textAlign: 'center',
          fontFamily: 'Unbounded',
          fontSize: '14px',
          fontWeight: 300,
          marginTop: 10,
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
        Invite Friends and Earn Points Get <br /> up to <strong
        style={{
          color: '#FBCA04',
          fontSize: 14,
          fontWeight: 600
        }}
      >$5000</strong>
      </div>
      <div
        style={{
          width: '100%',
          marginTop: 27,
          padding: '0 20px',
        }}
      >
        <button
          type="button"
          style={{
            width: '100%',
            height: 54,
            color: "#000",
            textAlign: "center",
            fontFamily: "Unbounded",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
            padding: "0 65px",
            borderRadius: "30px",
            background: "var(--part-bg)",
            border: '1px solid #000',
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
            height: 54,
            color: "#000",
            textAlign: "center",
            fontFamily: "Unbounded",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
            padding: "0 65px",
            borderRadius: "30px",
            background: "#FFF",
          }}
          onClick={handleCancel}
        >
          No, Thanks
        </button>
      </div>
    </AirdropCard>
  );
};

export default AirdropRefer;
