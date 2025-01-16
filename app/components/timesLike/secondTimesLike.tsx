import type { Project } from "@/app/type";
import styles from "./index.module.css";
import MainBtn from "@/app/components/mainBtn";
import { useHomeTab } from "@/app/store/useHomeTab";
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";

interface Props {
  data: Project;
  onClose: () => void;
  onShare: (data: Project) => void;
}

export const SECOND_LIKE_TIMES = 30;

export default function SecondTimeLike({ data, onClose, onShare }: Props) {
  const { set: setHomeTabIndex }: any = useHomeTab();

  return (
    <div className={styles.main + ' ' + styles.secondTimeLike}>
      <div className={styles.content}>
        <img src="/img/home/times30.svg" className={styles.topImg} />
        <div className={styles.text}>
          {'You’ve liked 30 times. '}
        </div>

        <div className={styles.text} style={{ marginTop: 30 }}>
          Now try to <strong>Buy</strong> a meme<br/> token, and mining<br/> 
          <strong>30 $FlipN</strong>
        </div>

        <MainBtn
          onClick={() => {
            onClose?.();
            setHomeTabIndex({
              homeTabIndex: 1
            });
            if (window.location.pathname !== "/") {
              window.location.href = "/";
            }
          }}
          style={{ 
            background: "#C9FF5D url(/img/home/timesBuy.png) no-repeat center center", 
            marginTop: 30, 
            color: "#000", 
            border: '1px solid #000', 
            width: '200px',
            fontWeight: 600
           }}
        >
          Buy Now
        </MainBtn>

        <div className={styles.learnTip}>
          Learn about{" "}
          <a className={styles.learnLink} href="#">
            {"‘"}How to trade{"’"}
          </a>
        </div>
      </div>
    </div>
  );
}
