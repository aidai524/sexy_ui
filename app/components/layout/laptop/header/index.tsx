import styles from "./index.module.css";
import Tips from "@/app/components/page-header/mobile/tips";
import SearchBar from "@/app/components/search-bar";

export default function Header() {
  return (
    <div className={styles.Container}>
      <Tips isCustomWidth />
      <SearchBar />
    </div>
  );
}
