import styles from "./index.module.css";

export default function Laptop({ children }: any) {
  return <div className={styles.Container}>{children}</div>;
}
