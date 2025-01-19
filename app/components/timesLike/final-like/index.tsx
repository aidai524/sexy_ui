import styles from "./index.module.css";
import ModalClose from "../../icons/modal-close";

export default function FinalLike({ token, onClose }: any) {
  return (
    <>
      <div className={styles.Container}>
        <div className={styles.Title}>Thanks for your final like❤️</div>
        <div className={styles.Desc}>
          <img className={styles.Avatar} src={token.tokenIcon} />
          <div>{token.tokenName} IS LAUNCHING!</div>
        </div>
      </div>
      <img
        src="/img/home/launch.gif"
        width={500}
        height={500}
        className={styles.Launching}
      />
      <div className={`${styles.CloseBtn} button`} onClick={onClose}>
        <ModalClose />
      </div>
    </>
  );
}
