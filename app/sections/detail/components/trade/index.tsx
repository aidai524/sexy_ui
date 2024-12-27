import CA from "../ca";
import styles from "./index.module.css";
import Trade from "@/app/components/trade";
import Holder from "@/app/components/holder";
import type { Project } from "@/app/type";

interface Props {
  data: Project;
  from?: string;
}

export default function TradeInfo({ data, from }: Props) {

  console.log('from:', from)

  return (
    <div className={from === "laptop" ? styles.LaptopContainer : ""}>
      <CA from={from} data={data}/>
      <Trade
        token={data}
        from={from}
      />
      <Holder from={from} />
    </div>
  );
}
