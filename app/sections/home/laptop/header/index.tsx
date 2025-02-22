import styles from "./index.module.css";
import Tabs from "../../mobile/tabs";
import Tips from "@/app/components/page-header/mobile/tips";
import Top1 from "./top-1";

export default function Header() {
  return (
    <div className={styles.Container}>
      <Tips />
      <Tabs />
      <Top1 />
    </div>
  );
}
