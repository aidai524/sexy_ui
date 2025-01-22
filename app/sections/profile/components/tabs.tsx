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
import { SHOW_COPY_TRADE } from "@/app/utils/config";

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
  style
}: any) {
  const homeTabStore: any = useHomeTab();
  const { prepaidDelayTime } = usePrepaidDelayTimeStore();
  const { likedListKey, flipListKey, createListKey } = useLaptop();
  const { isMobile } = useUserAgent();
  // base tab
  const createTabContent = (type: string, tabName: string) => ({
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
        isCurrent={homeTabStore.profileTabName === tabName}
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
      ...createTabContent("created", "Created")
    },
    {
      name: "Flipped",
      ...createTabContent("flipped", "Flipped")
    },
    {
      name: "Liked",
      ...createTabContent("liked", "Liked")
    }
  ];

  const tabs =
    isOther || !SHOW_COPY_TRADE
      ? baseTabs
      : [
          {
            name: "Coppied",
            content: <Coppied from={from} address={address} isOther={isOther} />
          },
          ...baseTabs
        ];

  return (
    <Tab
      nodes={tabs}
      onTabChange={(nodeName: string) => {
        homeTabStore.set({
          profileTabName: nodeName
        });
      }}
      activeNode={homeTabStore.profileTabName}
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
