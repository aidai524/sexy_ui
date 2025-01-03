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

  const context = useContext(AirdropContext);

  const btnLoading = useMemo(() => {
    return context.claiming || context.pointListLoading;
  }, [context.claiming, context.pointListLoading]);

  useEffect(() => {
    context?.getList?.();
    context?.handleBind?.();
  }, []);

  return (
    <AirdropCard title="Congratulations!">
      <div className={styles.Content}>
        {
          !!context.pointList?.length ? (
            <>
              {context.pointList?.map((it, idx) => (
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
                loadMore={context?.getList as () => Promise<void>}
                hasMore={context.pointListPageMore as boolean}
              >
                <InfiniteScrollContent hasMore={context.pointListPageMore} />
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
          onClick={context.handleClaim}
          disabled={btnLoading}
        >
          {
            btnLoading && (
              <Loading size={16} />
            )
          }
          <div>Claim</div>
        </button>
      </div>
    </AirdropCard>
  );
};

export default AirdropList;
