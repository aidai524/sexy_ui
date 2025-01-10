"use client";
import Info from "./components/info/detail";
import Chart from "./components/chart/index";
import Trade from "./components/trade/index";
import Txs from "./components/txs/index";
import { AvatarBack } from "@/app/components/thumbnail/avatar";
import styles from "./detail.module.css";
import { useEffect, useMemo, useState } from "react";
import Tab from "@/app/components/tab";
import SexPullToRefresh from "@/app/components/sexPullToRefresh";
import CircleLoading from "@/app/components/icons/loading";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import useTokenDetail from "./use-token-detail";
import useMc from "@/app/hooks/useMc";
import AvatarDetail from "@/app/components/avatarDetail";
import Back from "@/app/components/backNew";
import Menu from "@/app/components/menu";
import CommnentList from "./components/comment/commnet";

export default function Detail({ token, onBack, onNext }: any) {
  const [activeKey, setActiveKey] = useState("Info");
  const {
    infoData: queryedInfoData,
    isLoading,
    getDetailInfo
  } = useTokenDetail({ token });
  const [mc, setMC] = useState<string | number>("-");

  const infoData = useMemo(
    () => token || queryedInfoData,
    [token, queryedInfoData]
  );

  const { mc: pumpMc } = useMc({
    tokenAddress: infoData?.address,
    disable: infoData?.status < 1
  });

  const { getMC, pool } = useTokenTrade({
    tokenName: infoData?.tokenName as string,
    tokenSymbol: infoData?.tokenSymbol as string,
    tokenDecimals: infoData?.tokenDecimals as number,
    loadData: false
  });

  useEffect(() => {
    if (
      pool &&
      pool.length > 0 &&
      infoData?.DApp === "sexy" &&
      infoData?.status === 1
    ) {
      getMC().then((res) => {
        setMC(res as number);
      });
    }
  }, [pool, infoData]);

  useEffect(() => {
    onBack &&
      infoData &&
      history.pushState(
        { page: "/detail" },
        "Detail",
        `/detail?address=${infoData.address}`
      );
  }, [onBack, infoData]);

  if (isLoading) {
    return (
      <div className={styles.loadingBox}>
        <CircleLoading size={60} />
      </div>
    );
  }
  return (
    <SexPullToRefresh
      onRefresh={async () => {
        await getDetailInfo();
      }}
    >
      <div className={styles.main}>
        <div className={styles.Content}>
          <div className={ styles.header }>
            <div className={ styles.backWrapper }>
              <Back />
              <AvatarDetail token={infoData} mc={pumpMc || mc}/>
            </div>
            <div className={ styles.menuWrapper }>
              <Menu />
            </div>
          </div>

          <Chart token={infoData}/>

          <Tab
              activeNode={activeKey}
              onTabChange={(nodeName) => {
                setActiveKey(nodeName);
              }}
              nodes={[
                {
                  name: "Info",
                  content: (
                    <Info
                      mc={pumpMc || mc}
                      data={infoData}
                      onUpdate={() => {
                        getDetailInfo();
                      }}
                    />
                  )
                },
                {
                  name: "Comments",
                  content: (
                    <CommnentList token={infoData}/>
                  )
                },
                {
                  name: "Trade",
                  content: <Txs mc={pumpMc || mc} data={infoData} />
                }
              ]}
            />
          
          

          {/* {infoData.status === 0 ? (
            <Info
              data={infoData}
              mc={pumpMc || mc}
              onUpdate={() => {
                getDetailInfo?.();
                onNext?.();
              }}
            />
          ) : (
            <Tab
              activeNode={activeKey}
              onTabChange={(nodeName) => {
                setActiveKey(nodeName);
              }}
              nodes={[
                {
                  name: "Info",
                  content: (
                    <Info
                      mc={pumpMc || mc}
                      data={infoData}
                      onUpdate={() => {
                        getDetailInfo();
                      }}
                    />
                  )
                },
                {
                  name: "Chart",
                  content: <Chart data={infoData} />
                },
                {
                  name: "Buy/Sell",
                  content: (
                    <Trade mc={pumpMc || mc} from="mobile" data={infoData} />
                  )
                },
                {
                  name: "Txs",
                  content: <Txs mc={pumpMc || mc} data={infoData} />
                }
              ]}
            />
          )} */}
        </div>
      </div>
    </SexPullToRefresh>
  );
}
