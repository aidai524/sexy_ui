import styles from "./paid.module.css";

export default function Paid(props: any) {
  const { style } = props;

  return (
    <div className={styles.Tag} style={style}>
      <span>FastPass</span>
    </div>
  );
}