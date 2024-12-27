import styles from "./index.module.css";
import Icon from "./icon";

export default function PointsLabel({ id }: any) {
  return (
    <div className={styles.Container} id={id}>
      <Icon size={30} />
      <div>
        <div className={styles.Title}>0.00</div>
        <div className={styles.Desc}>$SEXYFI</div>
      </div>
    </div>
  );
}
