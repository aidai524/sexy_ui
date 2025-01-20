import Tab from "./tab";
import Created from "./created";
import Held from "./held";
import { useEffect, useMemo, useState } from "react";
import { useHomeTab } from "@/app/store/useHomeTab";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { useUserAgent } from "@/app/context/user-agent";
import { useLaptop } from "@/app/context/laptop";
import { useAccount } from "@/app/hooks/useAccount";
import Coppied from "@/app/sections/profile/components/coppied";
import { SHOW_COPY_TRADE } from '@/app/utils/config'

export default function Tabs({
  address,
  tabContentStyle,
  tabHeaderStyle,
  from,
  isOther,
  tabHeadersClassName,
  tabHeadersStyle,
  cursorClassName,
  tabContentClassName,
  cursorStyle,
  style,
}: any) {
  const homeTabStore: any = useHomeTab();
  const { prepaidDelayTime } = usePrepaidDelayTimeStore();
  const { likedListKey, flipListKey, createListKey } = useLaptop();
  // base tab
  const createTabContent = (type: string, index: number) => ({
    content: (
      <Created
        hideHot={type === "created"}
        address={address}
        type={type}
        isOther={isOther}
        prepaidWithdrawDelayTime={prepaidDelayTime}
        from={from}
        refresher={
          type === "created"
            ? createListKey
            : type === "flipped"
            ? flipListKey
            : likedListKey
        }
        isCurrent={homeTabStore.profileTabIndex === index}
      />
    )
  });

  const baseTabs = [
    {
      name: "Held",
      content: <Held from={from} address={address} />
    },
    {
      name: "Created",
      ...createTabContent("created", 1)
    },
    {
      name: "Flipped",
      ...createTabContent("flipped", 2)
    },
    {
      name: "Liked",
      ...createTabContent("liked", 3)
    }
  ];

  const tabs = isOther || !SHOW_COPY_TRADE
    ? baseTabs
    : [
        {
          name: "Coppied",
          content: <Coppied from={from} address={address} />
        },
        ...baseTabs
      ];

  const activeNode = useMemo(
    () => tabs[homeTabStore.profileTabIndex]?.name,
    [homeTabStore.profileTabIndex]
  );

  return (
    <Tab
      nodes={tabs}
      onTabChange={(nodeName: string) => {
        let defaultIndex = 0;
        tabs.some((tab, index) => {
          defaultIndex = index;
          return tab.name === nodeName;
        });
        homeTabStore.set({
          profileTabIndex: defaultIndex
        });
      }}
      activeNode={activeNode}
      tabContentStyle={tabContentStyle}
      tabHeaderStyle={tabHeaderStyle}
      tabHeadersClassName={tabHeadersClassName}
      tabHeadersStyle={tabHeadersStyle}
      cursorClassName={cursorClassName}
      tabContentClassName={tabContentClassName}
      cursorStyle={cursorStyle}
      style={style}
    />
  );
}
