import Tab from "./tab";
import Created from "./created";
import Held from "./held";
import { useEffect, useMemo, useState } from "react";
import { useHomeTab } from "@/app/store/useHomeTab";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";

export default function Tabs({
  showHot,
  address,
  defaultIndex,
  tabContentStyle,
  from,
  onTabChange
}: any) {
  const { set: setProfileTabIndex }: any = useHomeTab();
  const { prepaidDelayTime } = usePrepaidDelayTimeStore()

  console.log('prepaidDelayTime:', prepaidDelayTime)

  const tabs = useMemo(() => {
    const _tabs = [
      {
        name: "Held",
        content: <Held from={from} />
      },
      {
        name: "Created",
        content: (
          <Created
            hideHot={true}
            address={address}
            type="created"
            prepaidWithdrawDelayTime={prepaidDelayTime}
            from={from}
          />
        )
      },
      {
        name: "Hot",
        content: (
          <Created
            address={address}
            type="hot"
            prepaidWithdrawDelayTime={prepaidDelayTime}
          />
        )
      },
      {
        name: "Liked",
        content: (
          <Created
            address={address}
            type="liked"
            prepaidWithdrawDelayTime={prepaidDelayTime}
          />
        )
      }
    ];
    return _tabs;
  }, [showHot, address, prepaidDelayTime]);

  const activeNode = useMemo(() => {
    return tabs[defaultIndex || 0].name;
  }, [defaultIndex, tabs]);

  return (
    <Tab
      nodes={tabs}
      onTabChange={(nodeName: string) => {
        let defaultIndex = 0;
        tabs.some((tab, index) => {
          defaultIndex = index;
          return tab.name === nodeName;
        });
        setProfileTabIndex({
          profileTabIndex: defaultIndex
        });
      }}
      activeNode={activeNode}
      tabContentStyle={tabContentStyle}
    />
  );
}
