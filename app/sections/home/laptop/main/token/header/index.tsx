import { useRouter } from "next/navigation";
import Tabs from "../tabs";
import ShareIcon from "@/app/components/icons/share";
import ZoomOutIcon from "@/app/components/icons/zoom-out";
import TypesTabs from "../../../../tabs";
import styles from "./index.module.css";
import { shareToX } from "@/app/utils/share";

export default function Header({
  tokenInfo,
  currentTab,
  type,
  setCurrentTab,
  onOpenFull
}: any) {
  const router = useRouter();

  return (
    <div className={styles.Container}>
      <TypesTabs
        launchIndex={type}
        setLaunchIndex={(launchType: any) => {
          router.push("/?launchType=" + launchType);
        }}
      />
      <div className={styles.Actions}>
        {tokenInfo?.status === 1 && (
          <Tabs currentTab={currentTab} onChangeTab={setCurrentTab} />
        )}
        <div className={styles.Buttons}>
          <button
            className="button"
            onClick={() => {
              shareToX(
                tokenInfo.tokenName,
                "https://sexyfi.dumpdump.fun/detail?id=" + tokenInfo.id
              );
            }}
          >
            <ShareIcon />
          </button>
          <button id="layout-zoom-out" className="button" onClick={onOpenFull}>
            <ZoomOutIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
