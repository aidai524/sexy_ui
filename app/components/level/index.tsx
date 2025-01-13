import styles from "./index.module.css";
export default function Level({ level, vipType }: any) {
  const _level = level || 1;
  return (
    <div
      className={styles.Container}
      style={{
        backgroundImage: `url(${!vipType || vipType === 'normal' ? '/img/profile/icon-level-inactive.svg' : '/img/profile/icon-level-active.svg'})`,
      }}
    >
      <div>Lv.{_level}</div>
    </div>
  );
}
