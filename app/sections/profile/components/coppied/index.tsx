import { useState } from "react";
import Empty from "@/app/components/empty";
import CopyList from "./coppiedList";

const MockData = [
  {
    id: 1,
    name: "Copy 1",
    amount: 100,
  },
  {
    id: 2,
    name: "Copy 2",
    amount: 200,
  },
];

export default function Coppied({}: any) {
  const [coppiedList, setCoppiedList] = useState([...MockData])
  console.log(coppiedList)
  if (coppiedList.length === 0) {
    return (
      <div style={{ paddingTop: 116 }}>
        <Empty text="No coppied yet" />
      </div>
    );
  }
  return (
   <CopyList coppiedList={coppiedList} />
  );
}
