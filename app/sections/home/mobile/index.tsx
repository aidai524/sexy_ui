import Home from "./home";
import dynamic from "next/dynamic";
import { HomeContext } from "./context";
import styles from "./index.module.css";
import { useState, useRef } from "react";

const DetailPage = dynamic(() => import("@/app/sections/detail/mobile"), {
  ssr: false
});

export default function Mobile() {
  const [token, setToken] = useState<any>();
  const homeRef = useRef<any>();

  return (
    <HomeContext.Provider value={{ token, setToken }}>
      <div
        style={{
          zIndex: token ? 10 : 0,
          opacity: token ? 1 : 0
        }}
        className={styles.Container}
      >
        <DetailPage
          infoData={token}
          onBack={() => {
            history.pushState({ page: "/" }, "Home", `/`);
            setToken(null);
          }}
          onNext={() => {
            homeRef.current?.onNext();
            history.pushState({ page: "/" }, "Home", `/`);
            setToken(null);
          }}
        />
      </div>
      <div
        style={{
          zIndex: token ? 0 : 10,
          opacity: token ? 0 : 1
        }}
        className={styles.Container}
      >
        <Home ref={homeRef} />
      </div>
    </HomeContext.Provider>
  );
}
