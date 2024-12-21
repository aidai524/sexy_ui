import Tab from "./tab";
import Created from "./created";
import Held from "./held";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";


export default function Tabs({ showHot, address, defaultIndex, tabContentStyle, onTabChange }: any) {
  const router = useRouter();
  const params = useSearchParams();

  const tabs = useMemo(() => {
    const _tabs = [
      {
        name: "Held",
        content: <Held />
      },
      {
        name: "Created",
        content: <Created address={address} type="created" />
      },
      {
        name: "Hot",
        content: <Created address={address} type="hot" />
      },
      {
        name: "Liked",
        content: <Created address={address} type="liked" />
      }
    ];
    return _tabs;
  }, [showHot, address]);

  const activeNode = useMemo(() => {
    return tabs[defaultIndex].name
  }, [defaultIndex, tabs])

  return <Tab nodes={tabs} onTabChange={(nodeName: string) => {
    let defaultIndex = 0
    tabs.some((tab, index) => {
      defaultIndex = index
      return tab.name === nodeName
    })
    const account = params.get("account")?.toString()
    let url = '/profile?tabIndex=' + defaultIndex
    if (account) {
      url += ('&account=' + account)
    }

    router.push(url)
  }} activeNode={activeNode} tabContentStyle={tabContentStyle} />;
}
