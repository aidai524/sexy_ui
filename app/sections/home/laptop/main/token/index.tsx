import ActionsBar from "../actions-bar/prelaunch";
import styles from "./index.module.css";
import Header from "./header";
import TokenCard from "../token-card";
import InfoPart from "@/app/sections/detail/components/info/infoPart";
import CommentComp from "@/app/components/comment";
import useData from "../../../hooks/use-data";

export default function Token() {
  const { infoData2, onLike, onHate, getnext } = useData("preLaunch");

  const like = () => {
    setTimeout(() => {
      getnext();
    }, 1000);
    onLike();
  };

  const hate = () => {
    setTimeout(() => {
      getnext();
    }, 1000);
    onHate();
  };
  return (
    <>
      <div className={styles.Container}>
        <div className={styles.SexyFi} />
        <Header tokenInfo={infoData2} />
        <div className={styles.Content}>
          <TokenCard token={infoData2} />
          {infoData2 && (
            <div className={styles.PanelWrapper}>
              <InfoPart
                showLikes={false}
                data={infoData2}
                showThumbnailHead={false}
                showTop={false}
                theme="light"
                sepSize={2}
              />
              <CommentComp id={infoData2.id} theme="light" />
            </div>
          )}
        </div>
      </div>
      <ActionsBar tokenInfo={infoData2} onLike={like} onHate={hate} />
    </>
  );
}
