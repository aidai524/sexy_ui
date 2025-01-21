import { WalletModalButton } from '@/app/libs/solana/wallet-adapter/modal';
import React from 'react';

const AirdropConnectContent = (props: any) => {
  const { onClose, isHideClose, style, descriptionStyle, titleStyle, connectBtnStyle, btnsStyle } = props;

  return (
    <div>
      <div
        style={{
          padding: '0 40px',
          ...style,
        }}
      >
        <div
          style={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Unbounded',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
            ...titleStyle,
          }}
        >
          Airdrop is coming!
        </div>
        <div
          style={{
            marginTop: 10,
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Unbounded',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            ...descriptionStyle,
          }}
        >
          Connect your wallet to verify your airdrops
        </div>
      </div>
      <div
        style={{
          marginTop: '17px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '0',
          padding: '0 20px',
          ...btnsStyle,
        }}
      >
        <WalletModalButton
          style={{
            width: '100%',
            height: '54px',
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Unbounded',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '30px',
            border: '1px solid #000',
            background: "var(--part-bg)",
            marginBottom: 0,
            ...connectBtnStyle,
          }}
        >
          Connect Wallet
        </WalletModalButton>
        {
          !isHideClose && (
            <button
              type="button"
              style={{
                width: '100%',
                height: '54px',
                textAlign: 'center',
                fontFamily: 'Unbounded',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '30px',
                border: '1px solid rgba(0, 0, 0, 0)',
                color: '#000',
                textDecoration: 'underline',
              }}
              onClick={onClose}
            >
              No, Thanks
            </button>
          )
        }
      </div>
    </div>
  );
};

export default AirdropConnectContent;
