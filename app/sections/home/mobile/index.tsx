import Home from "./home";
import dynamic from "next/dynamic";
import { HomeContext } from "./context";
import styles from "./index.module.css";
import { useState } from "react";
import { useProjects } from "@/app/store/use-projects";
import { useHomeTab } from "@/app/store/useHomeTab";

const DetailPage = dynamic(() => import("@/app/sections/detail/mobile"), {
  ssr: false
});

export default function Mobile() {
  const [token, setToken] = useState<any>();
  const homeTabStore: any = useHomeTab();
  const projectsStore = useProjects();

  return (
    <HomeContext.Provider
      value={{
        token,
        goDetail(token: any) {
          setToken(token);
        }
      }}
    >
      {token && (
        <div
          style={{
            zIndex: token ? 10 : 0,
            opacity: token ? 1 : 0
          }}
          className={styles.Container}
        >
          <DetailPage
            token={token}
            onBack={() => {
              setToken(null);
              history.pushState({ page: "/" }, "Home", `/`);
            }}
            onSuccess={(params: any) => {
              projectsStore.updateProject(
                homeTabStore.homeTabIndex === 0 ? "preLaunch" : "launching",
                { ...token, ...params }
              );
            }}
          />
        </div>
      )}
      <div
        style={{
          zIndex: token ? 0 : 10,
          opacity: token ? 0 : 1
        }}
        className={styles.Container}
      >
        <Home />
      </div>
    </HomeContext.Provider>
  );
}
