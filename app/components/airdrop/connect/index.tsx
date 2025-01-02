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
        background: "#18131C",
        backdropFilter: "blur(5px)",
        borderRadius: "20px",
        padding: "10px 10px 0",
        width: "355px",
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: '100%',
          height: '264px',
          background: 'url("/img/airdrop/banner.svg") no-repeat center / cover',
          color: '#FFF',
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
            width: 'calc(100% - 42px)',
            textAlign: 'center',
            position: 'absolute',
            bottom: '48px',
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
            color: '#FFF',
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
            border: '1px solid #FFF',
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
            border: '1px solid #18131C',
            color: '#7E8A93',
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
