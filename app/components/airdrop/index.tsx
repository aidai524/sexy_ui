import styles from "./index.module.css";
import AirdropCard from './components/card';
import { AirdropContext } from '@/app/components/airdrop/context';
import React, { useContext, useEffect, useMemo } from 'react';
import Loading from '@/app/components/icons/loading';
import { numberFormatter } from '@/app/utils/common';
import Big from 'big.js';
import UserInfoCard from '@/app/components/airdrop/components/userinfo-card';
import LevelCard, { Card } from '@/app/components/airdrop/components/level-card';
import InviteCard from '@/app/components/airdrop/components/invite-card';
import { useAccount } from '@/app/hooks/useAccount';
import { useAuth } from '@/app/context/auth';
import { useDebounceFn } from 'ahooks';
import Countdown from '@/app/components/airdrop/components/countdown';
import { createLevelAndPoints } from '@/app/components/airdrop/utils';

const AirdropList = (props: any) => {
  const {} = props;

  const {
    claiming,
    userData,
    getUserData,
    userDataLoading,
    handleBind,
    getAirdropData,
    handleClaim,
    airdropDataLoading,
    airdropData,
    onClose: onAirdropClose,
    userHasPoints,
    setConnectVisible,
  } = useContext(AirdropContext);
  const { address } = useAccount();
  const { accountRefresher } = useAuth();

  const isClaimed = airdropData?.clime_pump;

  const pointList = useMemo(() => {
    return createLevelAndPoints({
      userData,
      userHasPoints,
      airdropData,
    });
  }, [userData, address, airdropData]);

  const btnLoading = useMemo(() => {
    return claiming || airdropDataLoading || userDataLoading;
  }, [claiming, airdropDataLoading, userDataLoading]);

  const { run: setConnectVisibleDelay, cancel: setConnectVisibleDelayCancel } = useDebounceFn(() => {
    setConnectVisible?.(true);
  }, { wait: 300 });

  useEffect(() => {
    setConnectVisibleDelayCancel();
    if (!address || !accountRefresher) {
      setConnectVisibleDelay();
      return;
    }
    setConnectVisible?.(false);
    getUserData?.();
    handleBind?.();
    getAirdropData?.();
  }, [address, accountRefresher]);

  return (
    <AirdropCard
      title={<UserInfoCard />}
      contentStyle={{
        paddingTop: 68,
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
      <div className={styles.AirdropInfoContent}>
        <div className={styles.Content}>
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
                        onStart={() => {
                          onAirdropClose?.();
                        }}
                        userHasPoints={userHasPoints}
                      />
                    );
                  }
                  if (userHasPoints) {
                    return (
                      <Card
                        key={idx}
                        icon={it.icon}
                        title={it.total}
                        description={it.desc}
                      />
                    );
                  }
                  return (
                    <InviteCard
                      key={idx}
                      onReferAfter={() => {
                        onAirdropClose?.();
                      }}
                    />
                  );
                })}
              </>
            ) : (
              <div style={{ marginTop: 60 }}>Loading...</div>
            )
          }
        </div>
        {
          userHasPoints && (
            <div
              style={{
                width: "100%",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                style={{
                  width: "100%",
                  height: isClaimed ? "unset" : "54px",
                  border: isClaimed ? "unset" : "1px solid #000",
                  borderRadius: "27px",
                  background: isClaimed ? "unset" : "var(--part-bg)",
                  color: "#000",
                  textAlign: "center",
                  fontFamily: "Unbounded",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'opacity 0.3s ease-in-out',
                  opacity: btnLoading ? 0.3 : 1,
                  cursor: btnLoading ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleClaim?.()}
                disabled={btnLoading}
              >
                {
                  btnLoading && (
                    <Loading size={16} />
                  )
                }
                <div>
                  {
                    isClaimed ? (
                      // Big(userData?.points ?? 0).lte(0) ? 'Earn More' : 'Airdrop Claimed'
                      // 'Airdrop Claimed'
                      'Want to earn more? >'
                    ) : 'Claim'
                  }
                </div>
              </button>
            </div>
          )
        }
      </div>
    </AirdropCard>
  );
};

export default AirdropList;
