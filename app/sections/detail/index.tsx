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
import { useVip } from "@/app/hooks/useVip";
import { useRouter, useSearchParams } from "next/navigation";
import { httpGet } from "@/app/utils";
import { mapDataToProject } from "@/app/utils/mapTo";

export default function Detail() {
  const params = useSearchParams();
  const [activeKey, setActiveKey] = useState("Info");
  const [infoData, setInfoData] = useState<Project>();

  useEffect(() => {
    getDetailInfo()
  }, [params]);

  const getDetailInfo = useCallback(() => {
    const id = params.get("id");
    if (id) {
      httpGet("/project", { id }).then((res) => {
        if (res.code === 0 && res.data) {
          // console.log(res)
          const infoData = mapDataToProject(res.data[0]);
          console.log('infoData:', infoData)
          setInfoData(infoData);
        }
      });
    }
  }, [params])

  if (!infoData) {
    return <></>;
  }

  return (
    <div className={styles.main}>
      <AvatarBack data={infoData} />

      {infoData.status === 0 ? (
        <Info data={infoData} onUpdate={() => {  getDetailInfo() }} />
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
              content: <Trade data={infoData} />
            },
            {
              name: "Txs",
              content: <Txs data={infoData} />
            }
          ]}
        />
      )}
    </div>
  );
}
