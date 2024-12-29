"use client";
import Info from "./components/info/detail";
import Chart from "./components/chart/index";
import Trade from "./components/trade/index";
import Txs from "./components/txs/index";

import { AvatarBack } from "@/app/components/thumbnail";

import styles from "./detail.module.css";
import { useCallback, useEffect, useState } from "react";
import Tab from "@/app/components/tab";
import type { Project } from "@/app/type";
import { useRouter, useSearchParams } from "next/navigation";
import { httpGet, sleep } from "@/app/utils";
import { mapDataToProject } from "@/app/utils/mapTo";
import SexPullToRefresh from "@/app/components/sexPullToRefresh";
import { useUserAgent } from "@/app/context/user-agent";
import { SpinLoading } from "antd-mobile";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { updateOneInList } from "@/app/utils/listStore";

export default function Detail() {
  const { isMobile } = useUserAgent()
  const params = useSearchParams();
  const [activeKey, setActiveKey] = useState("Info");
  const [infoData, setInfoData] = useState<Project>();
  const [mc, setMC] = useState<string | number>('-')

  const {
    getMC,
    pool,
  } = useTokenTrade({
    tokenName: infoData?.tokenName as string,
    tokenSymbol: infoData?.tokenSymbol as string,
    tokenDecimals: infoData?.tokenDecimals as number,
    loadData: false
  });

  useEffect(() => {
    getDetailInfo()
  }, [params]);

  useEffect(() => {
    if (pool && pool.length > 0 && infoData?.DApp === 'sexy' && infoData?.status === 1) {
      getMC().then(res => {
        setMC(res as number)
      })
    }
  }, [pool, infoData])

  const getDetailInfo = useCallback(() => {
    const id = params.get("id");
    if (id) {
      return httpGet("/project", { id }).then((res) => {
        if (res.code === 0 && res.data && res.data.length) {
          const infoData = mapDataToProject(res.data[0]);
          setInfoData(infoData);
          updateOneInList({
            ...res.data[0],
          })
        }
      });
    }
  }, [params])

  if (!infoData) {
    return <div className={ styles.loadingBox }><SpinLoading style={{ '--size': '148px' }} /></div>;
  }

  return (
    <SexPullToRefresh
      onRefresh={async () => {
        await getDetailInfo()
      }}>
      <div className={styles.main}>
        <AvatarBack data={infoData} />

        {infoData.status === 0 ? (
          <Info data={infoData} onUpdate={() => { getDetailInfo() }} />
        ) : (
          <Tab
            activeNode={activeKey}
            onTabChange={(nodeName) => {
              setActiveKey(nodeName);
            }}
            nodes={[
              {
                name: "Info",
                content: <Info data={infoData} onUpdate={() => { getDetailInfo() }} />
              },
              {
                name: "Chart",
                content: <Chart data={infoData} />
              },
              {
                name: "Buy/Sell",
                content: <Trade mc={mc} from={isMobile ? 'mobile' : 'laptop'} data={infoData} />
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
