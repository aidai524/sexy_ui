import styles from "./index.module.css";
import Media from "@/app/components/thumbnail/media";
import Desc from "@/app/sections/home/mobile/token/desc";
import Actions from "@/app/sections/home/mobile/actions";
import ArrowIcon from "../arrow-icon";
import { useUserAgent } from "@/app/context/user-agent";
import { useAuth } from "@/app/context/auth";
import { useState, useRef, useEffect, useMemo } from "react";

export default function Preview({ token }: any) {
  const { innerHeight, innerWidth } = useUserAgent();
  const [imgHeight, setImgHeight] = useState("80%");
  const [showDetail, setShowDetail] = useState(true);
  const descContentRef = useRef<any>();
  const { userInfo } = useAuth();

  const info = useMemo(
    () => ({
      ...token,
      creater: userInfo,
      time: Date.now(),
      status: 0,
      like: 0
    }),
    [token]
  );

  useEffect(() => {
    if (descContentRef.current) {
      setImgHeight(`${innerHeight - descContentRef.current.clientHeight}px`);
    }
  }, []);

  return (
    <>
      <div
        style={{
          height: innerHeight,
          width: innerWidth
        }}
        className={styles.Token}
      >
        <Media imgHeight={imgHeight} data={token} />
        <div className={styles.Desc} ref={descContentRef}>
          <Desc token={info} />
        </div>
        <div className={styles.ActionsWrapper}>
          <button
            className={`button ${styles.DetailBtn}`}
            style={{
              transform: `rotate(${showDetail ? 0 : 180}deg)`
            }}
            onClick={() => {
              setShowDetail(!showDetail);
            }}
          >
            <ArrowIcon />
          </button>
          <Actions token={info} disabled={true} isCurrent={true} />
        </div>
      </div>
    </>
  );
}
