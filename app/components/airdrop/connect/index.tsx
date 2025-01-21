import React from 'react';
import AirdropCard from '@/app/components/airdrop/components/card';
import Countdown from '@/app/components/airdrop/components/countdown';
import AirdropConnectContent from '@/app/components/airdrop/connect/content';

const AirdropConnect = (props: any) => {
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
