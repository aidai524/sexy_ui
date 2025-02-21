import styles from "./index.module.css";
import Tabs from "../../mobile/tabs";
import Tips from "@/app/components/page-header/mobile/tips";

export default function Header() {
  return (
    <div className={styles.Container}>
      <Tips />
      <Tabs />
    </div>
  );
}
