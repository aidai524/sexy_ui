import ActionsBar from "../actions-bar/prelaunch";
import styles from "./index.module.css";
import Header from "./header";
import TokenCard from "../token-card";
import useData from "../../../hooks/use-data";

export default function Token() {
  const { infoData2, onLike, onHate, getnext } = useData();
  console.log(infoData2);
  const like = () => {
    setTimeout(() => {
      getnext('preLaunch');
    }, 1000);
    onLike();
  };

  const hate = () => {
    setTimeout(() => {
      getnext('preLaunch');
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
        </div>
      </div>
      <ActionsBar tokenInfo={infoData2} onLike={like} onHate={hate} />
    </>
  );
}
