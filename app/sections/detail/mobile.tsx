"use client";
import Info from "./components/info/detail";
import Chart from "./components/chart/index";
import Trade from "./components/trade/index";
import Txs from "./components/txs/index";

import { AvatarBack } from "@/app/components/thumbnail";

import styles from "./detail.module.css";
import { useEffect, useState } from "react";
import Tab from "@/app/components/tab";
import SexPullToRefresh from "@/app/components/sexPullToRefresh";
import { SpinLoading } from "antd-mobile";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";

export default function Detail({ infoData, getDetailInfo }: any) {
  const [activeKey, setActiveKey] = useState("Info");

  const [mc, setMC] = useState<string | number>("-");

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
        console.log('mc:', mc)

        setMC(res as number);
      });
    }
  }, [pool, infoData]);

  if (!infoData) {
    return (
      <div className={styles.loadingBox}>
        <SpinLoading style={{ "--size": "148px" }} />
      </div>
    );
  }

  return (
    <SexPullToRefresh
      onRefresh={async () => {
        await getDetailInfo();
      }}
    >
      <div
        className={styles.main}
        style={{ minHeight: "100vh", background: "rgba(255, 38, 129, 1)" }}
      >
        <AvatarBack data={infoData} />

        {infoData.status === 0 ? (
          <Info
            data={infoData}
            mc={mc}
            onUpdate={() => {
              getDetailInfo();
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
                    mc={mc}
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
                content: <Trade mc={mc} from="mobile" data={infoData} />
              },
              {
                name: "Txs",
                content: <Txs mc={mc} data={infoData} />
              }
            ]}
          />
        )}
      </div>
    </SexPullToRefresh>
  );
}
