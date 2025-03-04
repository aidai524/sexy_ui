import styles from "./index.module.css";
import Tabs from "../../mobile/tabs";
import Tips from "@/app/components/page-header/mobile/tips";
import Top1 from "./top-1";
import { useUserAgent } from "@/app/context/user-agent";
import SearchBar from "@/app/components/search-bar";

export default function Header() {
  const { screenWidth } = useUserAgent();

  return (
    <div
      className={styles.Container}
      style={{
        width: screenWidth > 1440 ? "100vw" : "100%",
        position: screenWidth > 1440 ? "fixed" : "absolute"
      }}
    >
      {screenWidth > 1440 ? (
        <div className={styles.Wrapper} style={{ gap: 30 }}>
          <Tips />
          <Tabs />
          <SearchBar />
          <Top1 />
        </div>
      ) : (
        <>
          <div className={styles.Wrapper} style={{ gap: 10 }}>
            <Tips />
            <Top1 />
            <SearchBar />
          </div>
          <div style={{ width: 426, margin: "0 auto" }}>
            <Tabs />
          </div>
        </>
      )}
    </div>
  );
}
