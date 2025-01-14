import Tab from "./tab";
import Created from "./created";
import Held from "./held";
import { useEffect, useMemo, useState } from "react";
import { useHomeTab } from "@/app/store/useHomeTab";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { useUserAgent } from "@/app/context/user-agent";
import { useLaptop } from "@/app/context/laptop";
import Coppied from "@/app/sections/profile/components/coppied";

export default function Tabs({
  address,
  tabContentStyle,
  tabHeaderStyle,
  from,
  isOther,
  tabHeadersClassName,
  tabHeadersStyle,
  cursorClassName,
  tabContentClassName
}: any) {
  const homeTabStore: any = useHomeTab();
  const { prepaidDelayTime } = usePrepaidDelayTimeStore();
  const { isMobile } = useUserAgent();

  const { likedListKey, flipListKey, createListKey } = useLaptop();

  const tabs = [
    // {
    //   name: "Coppied",
    //   content: <Coppied from={from} address={address} />
    // },
    {
      name: "Held",
      content: <Held from={from} address={address} />
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
          refresher={createListKey}
          isCurrent={homeTabStore.profileTabIndex === 1}
        />
      )
    },
    {
      name: "Flipped",
      content: (
        <Created
          address={address}
          type="flipped"
          isOther={isOther}
          prepaidWithdrawDelayTime={prepaidDelayTime}
          refresher={flipListKey}
          isCurrent={homeTabStore.profileTabIndex === 2}
          from={from}
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
          refresher={likedListKey}
          isCurrent={homeTabStore.profileTabIndex === 3}
          from={from}
        />
      )
    }
  ];

  const activeNode = useMemo(
    () => tabs[homeTabStore.profileTabIndex].name,
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
    />
  );
}
