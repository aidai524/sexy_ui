import AirdropCard from '../components/card';
import React, { useContext } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';
import { numberFormatter } from '@/app/utils/common';
import Countdown from '@/app/components/airdrop/components/countdown';

const AirdropClaimed = (props: any) => {
  const { onClose } = props;

  const { setMorePointsVisible, userData } = useContext(AirdropContext);

  const handleMore = () => {
    setMorePointsVisible?.(true);
    onClose?.();
  };

  return (
    <AirdropCard
      title=""
      contentStyle={{
        paddingTop: 50,
      }}
      addonContent={(
        <Countdown
          style={{
            position: 'absolute',
            zIndex: 3,
            top: 0,
            left: '50%',
            transform: 'translate(-50%, 125px)',
          }}
        />
      )}
    >
      <div
        style={{
          padding: '22px 60px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: 'url("/img/airdrop/user-points.svg") no-repeat center / contain',
          }}
        >
          <img
            src="/img/airdrop/icon-checked.svg"
            alt=""
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 25,
              height: 25,
            }}
          />
        </div>
        <div
          style={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Unbounded',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
            textTransform: 'capitalize',
            marginTop: 16,
          }}
        >
          Congratulations! <br />
          {numberFormatter(userData?.points, 0, true)} points claimed
        </div>
        <button
          type="button"
          style={{
            color: '#000',
            fontFamily: 'Unbounded',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            textTransform: 'capitalize',
            marginTop: 47,
            textAlign: 'center',
          }}
          onClick={handleMore}
        >
          Want to earn more? &gt;
        </button>
      </div>
    </AirdropCard>
  );
};

export default AirdropClaimed;
