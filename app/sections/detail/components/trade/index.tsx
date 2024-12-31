import CA from "../ca";
import styles from "./index.module.css";
import Trade from "@/app/components/trade";
import Holder from "@/app/components/holder";
import type { Project } from "@/app/type";

interface Props {
  data: Project;
  from?: string;
  mc: string | number;
}

export default function TradeInfo({ data, from, mc }: Props) {
  return (
    <div>
      <CA from={from} data={data} mc={mc} />
      {from !== "laptop-home" && <Trade token={data} from={from} />}
      <Holder from={from} />
    </div>
  );
}
