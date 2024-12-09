import Tab from "./tab";
import Created from "./created";
import Held from "./held";
import { useMemo } from "react";

export default function Tabs({ showHot, address, tabContentStyle }: any) {
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
        name: "Liked",
        content: <Created address={address} type="liked" />
      }
    ];

    if (showHot) {
      _tabs.splice(2, 0, {
        name: "Hot",
        content: <Created address={address} type="hot" />
      });
    }

    return _tabs;
  }, [showHot, address]);
  return <Tab nodes={tabs} tabContentStyle={tabContentStyle} />;
}