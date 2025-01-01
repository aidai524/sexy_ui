import { useRouter } from "next/navigation";
import Tabs from "../tabs";
import ShareIcon from "@/app/components/icons/share";
import ZoomOutIcon from "@/app/components/icons/zoom-out";
import TypesTabs from "../../../../tabs";
import styles from "./index.module.css";
import { shareToX } from "@/app/utils/share";
import { addSearchParam } from "@/app/utils/search-params";
import { useMessage } from "@/app/context/messageContext";

export default function Header({
  tokenInfo,
  currentTab,
  type,
  setCurrentTab,
  onOpenFull,
  from
}: any) {
  const router = useRouter();
  const { showShare } = useMessage()

  return (
    <div className={styles.Container}>
      {from !== "detail" ? (
        <TypesTabs
          launchIndex={type}
          setLaunchIndex={(launchType: any) => {
            router.push("/?" + addSearchParam("launchType", launchType));
          }}
        />
      ) : (
        <div />
      )}
      <div className={styles.Actions}>
        {tokenInfo?.status === 1 && (
          <Tabs currentTab={currentTab} onChangeTab={setCurrentTab} />
        )}
        <div className={styles.Buttons}>
          <button
            className="button"
            onClick={() => {
              showShare(tokenInfo)
              // shareToX(
              //   tokenInfo.tokenName,
              //   "https://app.flipn.fun/detail?id=" + tokenInfo.id
              // );
            }}
          >
            <ShareIcon />
          </button>
          {onOpenFull && (
            <button
              id="layout-zoom-out"
              className="button"
              onClick={onOpenFull}
            >
              <ZoomOutIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
