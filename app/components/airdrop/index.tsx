import styles from "./index.module.css";
import AirdropCard from './components/card';
import { AirdropContext } from '@/app/components/airdrop/context';
import { useContext, useEffect, useMemo } from 'react';
import Loading from '@/app/components/icons/loading';
import { numberFormatter } from '@/app/utils/common';
import Big from 'big.js';

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
  } = useContext(AirdropContext);

  const pointList = useMemo(() => {
    if (!userData || !Object.keys(userData).length) return [];
    return [
      {
        type: 'Level',
        total: userData.level,
      },
      {
        type: 'Points',
        total: `+${numberFormatter(userData.points, 0, true)}`,
      },
    ];
  }, [userData]);

  const btnLoading = useMemo(() => {
    return claiming || airdropDataLoading || userDataLoading;
  }, [claiming, airdropDataLoading, userDataLoading]);

  useEffect(() => {
    getUserData?.();
    handleBind?.();
    getAirdropData?.();
  }, []);

  return (
    <AirdropCard title="Congratulations!">
      <div className={styles.Content}>
        {
          !userDataLoading ? (
            <>
              {pointList?.map((it, idx) => (
                <div key={idx} className={styles.Card}>
                  <div className={styles.CardTitle}>
                    {
                      it.type === 'Level' ? (
                        <div>
                          Lv. <span className={styles.CardTitlePrimary}>{it.total}</span>
                        </div>
                      ) : (
                        <div>
                          {it.type} <span className={styles.CardTitlePrimary}>{it.total}</span>
                        </div>
                      )
                    }
                  </div>
                  <div className={styles.CardContent}>
                    Description Contains the user level and the purpose of the level
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={{ marginTop: 60 }}>Loading...</div>
          )
        }
      </div>
      <div
        style={{
          width: "100%",
          marginTop: "15px",
          paddingBottom: "15px",
        }}
      >
        <button
          type="button"
          style={{
            width: "100%",
            height: "54px",
            border: "2px solid #000",
            borderRadius: "27px",
            background: "#FBCA04",
            color: "#000",
            textAlign: "center",
            fontFamily: "Unbounded",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s ease-in-out',
            opacity: btnLoading ? 0.3 : 1,
            cursor: btnLoading ? 'not-allowed' : 'pointer',
          }}
          onClick={handleClaim}
          disabled={btnLoading}
        >
          {
            btnLoading && (
              <Loading size={16} />
            )
          }
          <div>
            {airdropData?.clime_pump || Big(userData?.points ?? 0).lte(0) ? 'Earn More' : 'Claim'}
          </div>
        </button>
      </div>
    </AirdropCard>
  );
};

export default AirdropList;
