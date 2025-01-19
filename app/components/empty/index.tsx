import styles from "./index.module.css";
import EmptyIcon from "./empty-icon";

export default function Empty({
  style,
  height,
  text,
  iconSize = 200,
  textStyle,
  id
}: any) {
  return (
    <div className={styles.Container} style={{ height, ...style }}>
      <EmptyIcon size={iconSize} id={id} />
      {text && (
        <div className={styles.Text} style={textStyle}>
          {text}
        </div>
      )}
    </div>
  );
}
