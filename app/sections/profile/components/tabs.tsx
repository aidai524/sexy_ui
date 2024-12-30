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
  isOther,
  onTabChange
}: any) {
  const { set: setProfileTabIndex }: any = useHomeTab();
  const { prepaidDelayTime } = usePrepaidDelayTimeStore()

  const tabs = [
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
          isOther={isOther}
          prepaidWithdrawDelayTime={prepaidDelayTime}
          from={from}
        />
      )
    },
    {
      name: "Flip",
      content: (
        <Created
          address={address}
          type="hot"
          isOther={isOther}
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
          isOther={isOther}
          prepaidWithdrawDelayTime={prepaidDelayTime}
        />
      )
    }
  ];

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
