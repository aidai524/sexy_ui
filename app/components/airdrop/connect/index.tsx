import React, { useContext } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';
import { WalletModalButton } from '@/app/libs/solana/wallet-adapter/modal';
import AirdropCard from '@/app/components/airdrop/components/card';

const AirdropConnect = (props: any) => {
  const { onClose } = props;

  return (
    <AirdropCard
      bannerStyle={{
        height: 265,
        backgroundImage: `url("/img/airdrop/connect-banner.svg")`,
      }}
      style={{
        paddingTop: 200,
      }}
      contentStyle={{
        paddingTop: 80,
      }}
    >
      <div>
        <div
          style={{
            padding: '0 40px',
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
            }}
          >
            Connect Wallet
          </WalletModalButton>
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
        </div>
      </div>
    </AirdropCard>
  );
};

export default AirdropConnect;
