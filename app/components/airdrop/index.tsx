import styles from "./index.module.css";
import AirdropCard from './components/card';
import AirdropConnectModal from '@/app/components/airdrop/connect/modal';
import { AirdropContext } from '@/app/components/airdrop/context';
import { useAirdrop } from '@/app/components/airdrop/hooks';
import AirdropMoreModal from '@/app/components/airdrop/more/modal';
import { useContext, useEffect, useMemo } from 'react';
import Loading from '@/app/components/icons/loading';
import { InfiniteScroll } from "antd-mobile";
import InfiniteScrollContent from '@/app/components/infinite-scroll-content';

const AirdropList = (props: any) => {
  const {} = props;

  const {
    claiming,
    pointListLoading,
    getList,
    handleBind,
    getAirdropData,
    pointList,
    pointListPageMore,
    handleClaim,
    airdropDataLoading,
    airdropData,
  } = useContext(AirdropContext);

  const btnLoading = useMemo(() => {
    return claiming || pointListLoading || airdropDataLoading;
  }, [claiming, pointListLoading, airdropDataLoading]);

  useEffect(() => {
    getList?.();
    handleBind?.();
    getAirdropData?.();
  }, []);

  return (
    <AirdropCard title="Congratulations!">
      <div className={styles.Content}>
        {
          !!pointList?.length ? (
            <>
              {pointList?.map((it, idx) => (
                <div key={idx} className={styles.Card}>
                  <div className={styles.CardTitle}>
                    {/*Lv. <span className={styles.CardTitlePrimary}>4</span>*/}
                    {it.type} <span className={styles.CardTitlePrimary}>+{it.total}</span>
                  </div>
                  <div className={styles.CardContent}>
                    Description Contains the user level and the purpose of the level
                  </div>
                </div>
              ))}
              <InfiniteScroll
                loadMore={getList as () => Promise<void>}
                hasMore={pointListPageMore as boolean}
              >
                <InfiniteScrollContent hasMore={pointListPageMore} />
              </InfiniteScroll>
            </>
          ) : (
            <div style={{ marginTop: 60 }}>No data</div>
          )
        }
      </div>
      <div
        style={{
          width: "100%",
          marginTop: "26px",
          paddingBottom: "36px",
        }}
      >
        <button
          type="button"
          style={{
            width: "100%",
            height: "60px",
            borderRadius: "30px",
            background: "#FF2681",
            color: "#FFF",
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
            {airdropData?.clime_pump ? 'Earn More' : 'Claim'}
          </div>
        </button>
      </div>
    </AirdropCard>
  );
};

export default AirdropList;
