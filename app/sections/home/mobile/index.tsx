import Home from "./home";
import dynamic from "next/dynamic";
import { HomeContext } from "./context";
import styles from "./index.module.css";
import { useState } from "react";
import { useProjects, LaunchType } from "@/app/store/use-projects-new";
import { useUserAgent } from "@/app/context/user-agent";
import { useVideoPlayer } from "@/app/store/use-video-player";
import { videoReg } from "@/app/components/upload";
import { useHomeTab } from "@/app/store/useHomeTab";

const DetailPage = dynamic(() => import("@/app/sections/detail/mobile"), {
  ssr: false
});
export default function Mobile() {
  const [token, setToken] = useState<any>();
  const [detailTab, setDetailTab] = useState<string>("");
  const projectsStore = useProjects();
  const { innerHeight, innerWidth } = useUserAgent();
  const videoPlayerStore: any = useVideoPlayer();
  const homeTabStore: any = useHomeTab();

  return (
    <HomeContext.Provider
      value={{
        token,
        goDetail(token: any, tab: string) {
          setToken(token);
          setDetailTab(tab);
          videoPlayerStore.setPlay(false);
          if (!tab || !["Info", "Trades"].includes(tab)) return;
          const loop = () => {
            setTimeout(() => {
              const ele = document.getElementById(
                tab === "Info" ? "detail-holders" : "detail-tabs"
              );
              const container = document.getElementById("detail-content");
              if (!ele || !container) {
                loop();
                return;
              }
              const top = ele?.offsetTop;
              container.scrollTop = top;
            }, 30);
          };

          loop();
        }
      }}
    >
      {token && (
        <div
          style={{
            zIndex: token ? 10 : 0,
            opacity: token ? 1 : 0,
            position: 'relative',
            width: innerWidth,
            height: innerHeight
          }}
          className={styles.Container}
        >
          <DetailPage
            token={token}
            tab={detailTab}
            onBack={() => {
              setToken(null);
              history.pushState({ page: "/" }, "Home", `/`);
              const isVideo = videoReg.test(token.tokenImg || "");
              if (isVideo && videoPlayerStore.autoPlay) {
                videoPlayerStore.setPlay(
                  true,
                  String(token.id) +
                    "_" +
                    Object.keys(LaunchType)[homeTabStore.homeTabIndex]
                );
              }
            }}
            onSuccess={(params: any) => {
              projectsStore.updateProject({ ...token, ...params });
            }}
          />
        </div>
      )}
      <div
        style={{
          zIndex: token ? 0 : 10,
          opacity: token ? 0 : 1,
          width: innerWidth,
          height: innerHeight
        }}
        className={styles.Container}
      >
        <Home />
      </div>
    </HomeContext.Provider>
  );
}
