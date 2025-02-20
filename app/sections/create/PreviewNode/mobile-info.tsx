import Tab from "@/app/components/tab";
import InfoPart from "../../detail/components/info/infoPart";
import { useMemo, useState } from "react";
import Desc from "../../detail/components/desc";
import CommnentList from "../../detail/components/comment/commnet";

const timeLeft = Date.now() + 1000 * 60 * 60 * 3

export default function Mobile({ newData }: any) {
  console.log('newData:', newData)
  const [activeKey, setActiveKey] = useState('')
  const tabs = useMemo(() => {
    const vals = [
      { name: "Details", content: <Desc data={newData} mc={0} specialTime={"just now"} /> },
      { name: "Comments", content: <CommnentList token={newData} /> },
    ];

    return vals;
  }, [newData]);
  return (
    <div>
      <InfoPart
        showLikes={false}
        data={{
          ...newData,
          icon: newData.tokenIcon || '/img/default-token.png',
          timeLeft: timeLeft
        }}
        theme="light"
        showHolders={false}
        showProgress={false}
        withoutFlip={true}
        showAddress={false}
      />

      <Tab
        activeNode={activeKey}
        onTabChange={(nodeName) => {
          setActiveKey(nodeName);
        }}
        nodes={tabs}
      />
    </div>
  );
}