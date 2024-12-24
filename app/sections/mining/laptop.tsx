import Back from "@/app/components/back/laptop";
import Content from "./content";
import styles from "./laptop.module.css";

export default function Laptop() {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Container}>
        <div className={styles.BackWrapper}>
          <Back />
        </div>
        <Content styles={styles} isMobile={false} />
      </div>
    </div>
  );
}
