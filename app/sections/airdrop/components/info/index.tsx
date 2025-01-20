import styles from "./index.module.css";
import AirdropHeader from '@/app/sections/airdrop/components/header';
import AirdropCard from '@/app/sections/airdrop/components/card';
import React, { useEffect, useMemo } from 'react';
import { createLevelAndPoints } from '@/app/components/airdrop/utils';
import { useAirdrop } from '@/app/components/airdrop/hooks';
import { useAccount } from '@/app/hooks/useAccount';
import LevelCard, { Card } from '@/app/components/airdrop/components/level-card';
import Loading from '@/app/components/icons/loading';
import { useCountdown } from '@/app/components/airdrop/hooks/use-countdown';
import { useRouter } from 'next/navigation';
import Big from 'big.js';
import { useAirdropStore } from '@/app/store/use-airdrop';

const AirdropInfo = (props: any) => {
  const { } = props;

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
    <div className={styles.AirdropInfoContainer}>
      <AirdropHeader />
      <AirdropCard className={styles.AirdropInfoCard}>
        <div className={styles.AirdropInfoTitle}>
          Hi! 2xba...e727
        </div>
        <div className={styles.AirdropInfoDesc}>
          According to your history on Pump.fun
        </div>
        <div className={styles.AirdropInfoSummaries}>
          <SummaryCard
            label="Volume"
            value="$3.45K"
          />
          <SummaryCard
            label="PNL"
            value="+$364.16"
          />
        </div>
        <div className={styles.AirdropInfoLevelPointsWrapper}>
          Your Level and airdrops on FlipN will be...
        </div>
        <div className={styles.AirdropInfoLevelPoints}>
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
        <div className={styles.AirdropInfoFooter}>
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
    </div>
  );
};

export default AirdropInfo;

const SummaryCard = (props: any) => {
  const { label, value } = props;

  return (
    <div className={styles.AirdropInfoSummaryCard}>
      <div className={styles.AirdropInfoSummaryCardLabel}>
        {label}
      </div>
      <div className={styles.AirdropInfoSummaryCardValue}>
        {value}
      </div>
    </div>
  );
};
