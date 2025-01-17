import { useReferStore } from '@/app/store/useRefer';
import { useContext } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';

export const Card = (props: any) => {
  const { title, onClick, btn, children, borderColor, bg } = props;

  return (
    <div
      style={{
        width: '100%',
        borderRadius: '12px',
        border: `2px solid ${borderColor}`,
        background: bg,
        padding: '16px 20px 17px',
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
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 8,
          color: "#000",
          fontFamily: "Unbounded",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 300,
          lineHeight: "normal",
          textAlign: "center",
        }}
      >
        {children}
      </div>
      <button
        type="button"
        style={{
          marginTop: 10,
          height: 42,
          color: "#000",
          textAlign: "center",
          fontFamily: "Unbounded",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
          padding: "0 70px",
          borderRadius: 21,
          background: "#FFF",
          border: "1px solid #000",
        }}
        onClick={onClick}
      >
        {btn}
      </button>
    </div>
  );
};

const InviteCard = (props: any) => {
  const { onReferAfter } = props;

  const referStore = useReferStore();
  const { setShareImageVisible } = useContext(AirdropContext);

  return (
    <Card
      title="Refer to Earn"
      btn="Refer"
      btnPrimary
      onClick={() => {
        // referStore.setVisible(true, true);
        setShareImageVisible?.(true);
        onReferAfter?.();
      }}
      borderColor="#90D800"
      bg="radial-gradient(74.25% 66.17% at 63.1% 125%, rgba(170, 255, 0, 0.80) 5.5%, rgba(231, 255, 220, 0.80) 100%)"
    >
      Invite Friends and earn kickback up to <span style={{ color: "#000", fontWeight: 600 }}>$5000</span>
    </Card>
  );
};

export default InviteCard;
