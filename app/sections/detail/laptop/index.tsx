import Token from "../../home/laptop/main/token";
import styles from "./index.module.css";

export default function Laptop({ infoData, getDetailInfo }: any) {
  return (
    <div className={styles.Container}>
      <Token infoData2={infoData} from="detail" />
    </div>
  );
}
