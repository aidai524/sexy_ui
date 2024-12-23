import Tab from "./tab";
import Created from "./created";
import Held from "./held";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useHomeTab } from "@/app/store/useHomeTab";


export default function Tabs({ showHot, address, defaultIndex, tabContentStyle, onTabChange }: any) {
  const router = useRouter();
  const params = useSearchParams();
  const [prepaidWithdrawDelayTime, setPrepaidWithdrawDelayTime] = useState(0)
  const { set: setProfileTabIndex }: any = useHomeTab()

  const { getConfig } = useTokenTrade({
    tokenName: '',
    tokenSymbol: '',
    tokenDecimals: 2
  })

  useEffect(() => {
    getConfig().then((stateData) => {
      setPrepaidWithdrawDelayTime(stateData.prepaidWithdrawDelayTime.toNumber())
    })
  }, [])

  const tabs = useMemo(() => {
    const _tabs = [
      {
        name: "Held",
        content: <Held />
      },
      {
        name: "Created",
        content: <Created hideHot={true} address={address} type="created" prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}/>
      },
      {
        name: "Hot",
        content: <Created address={address} type="hot" prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}/>
      },
      {
        name: "Liked",
        content: <Created address={address} type="liked" prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}/>
      }
    ];
    return _tabs;
  }, [showHot, address, prepaidWithdrawDelayTime]);

  const activeNode = useMemo(() => {
    return tabs[defaultIndex || 0].name
  }, [defaultIndex, tabs])

  return <Tab nodes={tabs} onTabChange={(nodeName: string) => {
    let defaultIndex = 0
    tabs.some((tab, index) => {
      defaultIndex = index
      return tab.name === nodeName
    })
    setProfileTabIndex({
      profileTabIndex: defaultIndex
    })
    
    // const account = params.get("account")?.toString()
    // let url = '/profile?tabIndex=' + defaultIndex
    // if (account) {
    //   url += ('&account=' + account)
    // }

    // router.push(url)
  }} activeNode={activeNode} tabContentStyle={tabContentStyle} />;
}
