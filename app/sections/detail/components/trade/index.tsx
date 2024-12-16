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
  return (
    <div className={from === "laptop" ? styles.LaptopContainer : ""}>
      <CA from={from} />
      <Trade
        token={{
          tokenName: data.tokenName,
          tokenSymbol: data.tokenSymbol as string,
          tokenUri: data.tokenIcon || data.tokenImg,
          tokenDecimals: 2
        }}
        from={from}
      />
      <Holder from={from} />
    </div>
  );
}
