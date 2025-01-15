import React, { useContext } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';
import { WalletModalButton } from '@/app/libs/solana/wallet-adapter/modal';

const AirdropConnect = (props: any) => {
  const { onClose } = props;

  const { onClose: onAirdropClose } = useContext(AirdropContext);

  const handleClose = () => {
    onClose?.();
    onAirdropClose?.();
  };

  return (
    <div
      style={{
        background: "#C9FF5D",
        border: "1px solid black",
        borderRadius: "20px",
        padding: "10px 17px 0",
        width: "323px",
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: '100%',
          height: '264px',
          background: 'url("/img/airdrop/banner.svg") no-repeat center / cover',
          color: '#000',
          textAlign: 'center',
          fontFamily: 'Unbounded',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 300,
          lineHeight: '120%', // 16.8px
          borderRadius: '15px',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 'calc(100% - 30px)',
            textAlign: 'center',
            position: 'absolute',
            bottom: '30px',
            left: '21px',
          }}
        >
          You are rewarded with points，Connect wallet Get it now!
        </div>
      </div>
      <div
        style={{
          marginTop: '18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '0',
        }}
      >
        <WalletModalButton
          style={{
            width: '100%',
            height: '60px',
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Unbounded',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '30px',
            border: '2px solid #000',
            background: '#FBCA04',
            marginBottom: 0,
          }}
        >
          Connect Wallet
        </WalletModalButton>
        <button
          type="button"
          style={{
            width: '100%',
            height: '60px',
            textAlign: 'center',
            fontFamily: 'Unbounded',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '30px',
            border: '1px solid rgba(0, 0, 0, 0)',
            color: '#000',
          }}
          onClick={handleClose}
        >
          No, Thanks
        </button>
      </div>
    </div>
  );
};

export default AirdropConnect;
