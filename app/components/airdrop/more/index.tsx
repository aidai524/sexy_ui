import AirdropCard from '../components/card';
import { useRouter } from 'next/navigation';
import { useReferStore } from '@/app/store/useRefer';
import { useContext, useEffect } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';
import { numberFormatter } from '@/app/utils/common';

const AirdropMore = (props: any) => {
  const { onClose } = props;

  const { getUserData, userData } = useContext(AirdropContext);

  const router = useRouter();
  const referStore = useReferStore();

  const handleCreate = () => {
    router.push('/create');
    onClose?.();
  };

  const handleRefer = () => {
    referStore.setVisible(true, true);
    onClose?.();
  };

  useEffect(() => {
    getUserData?.();
  }, []);

  return (
    <AirdropCard title="Want to earn more points?">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          position: 'absolute',
          left: 16,
          top: 16,
        }}
      >
        <Badge icon="/img/airdrop/diamond.svg" label={`Lv.${userData?.level ?? 1}`} />
        <Badge icon="/img/airdrop/points.svg" label={numberFormatter(userData?.points, 0, true)} />
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          marginTop: 16,
          paddingBottom: 24,
          height: 317,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Card
          title="Create a new token"
          btn="Create"
          onClick={handleCreate}
        >
          <span style={{ color: "#B31DFF", fontWeight: 600 }}>30%</span> integral amplification
        </Card>
        <Card
          title="Refer to Earn"
          btn="Refer"
          btnPrimary
          onClick={handleRefer}
        >
          Invite Friends and Earn Points Get up to <span style={{ color: "#B31DFF", fontWeight: 600 }}>1M</span>
        </Card>
      </div>
    </AirdropCard>
  );
};

export default AirdropMore;

const Card = (props: any) => {
  const { title, onClick, btn, children, btnPrimary } = props;

  return (
    <div
      style={{
        width: '100%',
        borderRadius: '10px',
        border: '1px solid rgba(161, 161, 161, 0.20)',
        background: '#FAFAFA',
        padding: '20px 15px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          color: "#000",
          textAlign: "center",
          fontFamily: "Unbounded",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: "10px",
          color: "#9290B1",
          fontFamily: "Unbounded",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 300,
          lineHeight: "normal",
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </div>
      <button
        type="button"
        style={{
          marginTop: "12px",
          height: "50px",
          color: "#FFF",
          textAlign: "center",
          fontFamily: "Unbounded",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
          padding: "0 65px",
          borderRadius: "30px",
          background: btnPrimary ? "#C926FF" : "#FF2681",
        }}
        onClick={onClick}
      >
        {btn}
      </button>
    </div>
  );
};

const Badge = (props: any) => {
  const { icon, label } = props;

  return (
    <div
      style={{
        height: '24px',
        flexShrink: 0,
        background: '#F2FFF8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        padding: '0 8px 0 6px',
        borderRadius: 12,
      }}
    >
      <img
        src={icon}
        alt=""
        style={{
          width: 16,
          height: 16,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          color: '#000',
          fontFamily: 'Unbounded',
          fontSize: '12px',
          fontWeight: 400,
        }}
      >
        {label}
      </div>
    </div>
  );
};
