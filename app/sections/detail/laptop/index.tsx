import Token from "../../home/laptop/main/token";
import Back from "@/app/components/back/laptop";
import styles from "./index.module.css";

export default function Laptop({ infoData, getDetailInfo }: any) {
  return (
    <div className={styles.Container}>
      <Token infoData2={infoData} from="detail" />
      <div className={styles.BackWrapper}>
        <Back />
      </div>
    </div>
  );
}
