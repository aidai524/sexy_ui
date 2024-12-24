import styles from "./limitProject.module.css";

export default function LimitProject({ list = [] }: any) {
  return (
    <div className={styles.main}>
      {list.map((item: any) => {
        return <img className={styles.img} key={item.id} src={item.icon} />;
      })}
      {list.length > 5 && <div className={styles.more}>+{list.length - 5}</div>}
    </div>
  );
}
