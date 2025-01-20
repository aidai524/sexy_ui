import styles from '@/app/sections/airdrop/components/info/index.module.css';
import SummaryCard from '@/app/sections/airdrop/components/info/summary-card';
import LevelCard, { Card } from '@/app/components/airdrop/components/level-card';
import Loading from '@/app/components/icons/loading';
import AirdropCard from '@/app/sections/airdrop/components/card';
import React, { useEffect, useMemo } from 'react';
import { useAirdrop } from '@/app/components/airdrop/hooks';
import { useAccount } from '@/app/hooks/useAccount';
import { useCountdown } from '@/app/components/airdrop/hooks/use-countdown';
import { useRouter } from 'next/navigation';
import { useAirdropStore } from '@/app/store/use-airdrop';
import Big from 'big.js';
import { createLevelAndPoints } from '@/app/components/airdrop/utils';
import { formatLongText, numberFormatter } from '@/app/utils/common';

const AirdropInfoContent = (props: any) => {
  const {
    className = '',
    titleClassName = '',
    descClassName = '',
    summariesClassName = '',
    levelPointsLabelClassName = '',
    levelPointsClassName = '',
    footerClassName = '',
  } = props;

  const {
    getAirdropData,
    getUserData,
    userData,
    airdropData,
    userHasPoints,
    userDataLoading,
    handleClaim,
    claiming,
  } = useAirdrop();
  const { address } = useAccount();
  const [countdown] = useCountdown();
  const router = useRouter();
  const { setHomepageVisited } = useAirdropStore();

  const isClaimed = airdropData?.clime_pump;
  const isEnded = !countdown?.end;
  const isStarted = !countdown?.start;
  const isPoints = Big(userData?.points ?? 0).gt(0);

  const pointList = useMemo(() => {
    return createLevelAndPoints({
      userData,
      userHasPoints,
      airdropData,
    });
  }, [userData, address, airdropData]);

  const buttonText = useMemo(() => {
    if (!countdown) return '';
    if (countdown?.startSplit?.[0] > 0) {
      return `${countdown.startSplit[0]} days`;
    }
    if (countdown?.startSplit?.[1] > 0) {
      return `${countdown.startSplit[1]} hours`;
    }
    if (countdown?.startSplit?.[2] > 0) {
      return `${countdown.startSplit[2]} minutes`;
    }
    return '';
  }, [countdown]);

  const onClaim = async () => {
    if (isEnded || isClaimed || !isPoints) {
      setHomepageVisited(address, true);
      router.replace('/');
      return;
    }
    const succeed = await handleClaim?.({ from: 'airdrop_before' });
    if (succeed) {
      setHomepageVisited(address, true);
      const timer = setTimeout(() => {
        clearTimeout(timer);
        router.replace('/');
      }, 2000);
    }
  };

  useEffect(() => {
    getAirdropData();
    getUserData();
  }, [address]);

  return (
    <AirdropCard className={[styles.AirdropInfoCard, className].join(' ')}>
      <div className={[styles.AirdropInfoTitle, titleClassName].join(' ')}>
        Hi! {formatLongText(address, 4, 4)}
      </div>
      <div className={[styles.AirdropInfoDesc, descClassName].join(' ')}>
        According to your history on Pump.fun
      </div>
      <div className={[styles.AirdropInfoSummaries, summariesClassName].join(' ')}>
        <SummaryCard
          label="Volume"
          value={numberFormatter(userData?.pump_volume, 2, true, { isShort: true, isShortUppercase: true, prefix: '$' })}
        />
        <SummaryCard
          label="PNL"
          value={userData?.pump_pnl > 0 ? '+' : '' + numberFormatter(userData?.pump_pnl, 2, true, { isShort: true, isShortUppercase: true, prefix: '$' })}
        />
      </div>
      <div className={[styles.AirdropInfoLevelPointsWrapper, levelPointsLabelClassName].join(' ')}>
        Your Level and airdrops on FlipN will be...
      </div>
      <div className={[styles.AirdropInfoLevelPoints, levelPointsClassName].join(' ')}>
        {
          !userDataLoading ? (
            <>
              {pointList?.map((it, idx) => {
                if (it.type === 'Level') {
                  return (
                    <LevelCard
                      key={idx}
                      icon={it.icon}
                      title={it.total}
                      description={it.desc}
                      level={userData?.level}
                      userHasPoints={true}
                    />
                  );
                }
                return (
                  <Card
                    key={idx}
                    icon={it.icon}
                    title={it.total}
                    description={it.desc}
                  />
                );
              })}
            </>
          ) : (
            <div className={styles.AirdropInfoLevelPointsLoading}>Loading...</div>
          )
        }
      </div>
      <div className={[styles.AirdropInfoFooter, footerClassName].join(' ')}>
        <button
          type="button"
          className={styles.AirdropInfoButton}
          onClick={onClaim}
          disabled={claiming || !isStarted}
        >
          {
            claiming && (
              <Loading size={14} />
            )
          }
          {
            !isStarted ? (
              <span>
                  Claimable in {buttonText}
                </span>
            ) : (
              isEnded ? (
                <span>Go to FlipN</span>
              ) : (
                (isClaimed || !isPoints) ? (
                  <span>Go to FlipN</span>
                ) : (
                  <span>Claim</span>
                )
              )
            )
          }
        </button>
      </div>
    </AirdropCard>
  );
};

export default AirdropInfoContent;
