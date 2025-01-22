import React, { useContext, useEffect } from 'react';
import AirdropCard from '@/app/components/airdrop/components/card';
import Countdown from '@/app/components/airdrop/components/countdown';
import AirdropConnectContent from '@/app/components/airdrop/connect/content';
import { AirdropContext } from '@/app/components/airdrop/context';
import { useAccount } from '@/app/hooks/useAccount';
import { useAuth } from '@/app/context/auth';

const AirdropConnect = (props: any) => {
  const { address } = useAccount();
  const { accountRefresher } = useAuth();
  const { setConnectVisible, setAirdropVisible } = useContext(AirdropContext);

  useEffect(() => {
    if (address && accountRefresher) {
      setConnectVisible?.(false);
      setAirdropVisible?.(true);
    }
  }, [address, accountRefresher]);

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
        paddingTop: 110,
      }}
      addonContent={(
        <Countdown
          style={{
            position: 'absolute',
            zIndex: 3,
            top: 0,
            left: '50%',
            transform: 'translate(-50%, 230px)',
          }}
        />
      )}
    >
      <AirdropConnectContent {...props} />
    </AirdropCard>
  );
};

export default AirdropConnect;
