import Home from "./home";
import dynamic from "next/dynamic";
import { HomeContext } from "./context";
import styles from "./index.module.css";
import { useState } from "react";
import { useProjects } from "@/app/store/use-projects-new";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useUserAgent } from "@/app/context/user-agent";

const DetailPage = dynamic(() => import("@/app/sections/detail/mobile"), {
  ssr: false
});

export default function Mobile() {
  const [token, setToken] = useState<any>();
  const homeTabStore: any = useHomeTab();
  const projectsStore = useProjects();
  const { innerHeight, innerWidth } = useUserAgent();

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
            opacity: token ? 1 : 0,
            width: innerWidth,
            height: innerHeight
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
