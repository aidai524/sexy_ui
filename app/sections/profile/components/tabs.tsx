import Tab from "./tab";
import Created from "./created";
import Held from "./held";
import { useEffect, useMemo, useState } from "react";
import { useHomeTab } from "@/app/store/useHomeTab";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { useUserAgent } from "@/app/context/user-agent";

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
  const { prepaidDelayTime } = usePrepaidDelayTimeStore();
  const { isMobile } = useUserAgent();
  const [tabIndex, setTabIndex] = useState(0);

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
    const i = isMobile ? defaultIndex || 0 : tabIndex;
    return tabs[i].name;
  }, [defaultIndex, tabs, tabIndex]);

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
    />
  );
}
