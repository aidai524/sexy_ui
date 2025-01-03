import Tab from "./tab";
import Created from "./created";
import Held from "./held";
import { useEffect, useMemo, useState } from "react";
import { useHomeTab } from "@/app/store/useHomeTab";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { useUserAgent } from "@/app/context/user-agent";
import { useLaptop } from "@/app/context/laptop";
export default function Tabs({
  showHot,
  address,
  defaultIndex,
  tabContentStyle,
  tabHeaderStyle,
  from,
  isOther,
  onTabChange
}: any) {
  const { set: setProfileTabIndex }: any = useHomeTab();
  const { prepaidDelayTime } = usePrepaidDelayTimeStore();
  const { isMobile } = useUserAgent();
  const [tabIndex, setTabIndex] = useState(0);
  const { likedListKey, flipListKey, createListKey } = useLaptop();

  const activeIndex = useMemo(
    () => (isMobile ? defaultIndex || 0 : tabIndex),
    [defaultIndex, tabIndex]
  );

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
          refresher={createListKey}
          isCurrent={activeIndex === 1}
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
          isCurrent={activeIndex === 2}
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
          isCurrent={activeIndex === 3}
          from={from}
        />
      )
    }
  ];

  const activeNode = useMemo(() => tabs[activeIndex].name, [activeIndex, tabs]);

  return (
    <Tab
      nodes={tabs}
      onTabChange={(nodeName: string) => {
        let defaultIndex = 0;
        tabs.some((tab, index) => {
          defaultIndex = index;
          return tab.name === nodeName;
        });
        isMobile
          ? setProfileTabIndex({
              profileTabIndex: defaultIndex
            })
          : setTabIndex(defaultIndex);
      }}
      activeNode={activeNode}
      tabContentStyle={tabContentStyle}
      tabHeaderStyle={tabHeaderStyle}
    />
  );
}
