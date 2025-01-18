import { useUserAgent } from "@/app/context/user-agent";
import styles from "./link.module.css";

interface Props {
  type?: string;
  img?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export default function Link({ type, img, value, onChange, onBlur }: Props) {
  const { isMobile } = useUserAgent();
  return (
    <div
      className={styles.linkBox}
      style={{
        backgroundColor: isMobile ? "rgba(18, 23, 25, 1)" : "transparent",
        padding: isMobile ? "0 20px 10px" : "0px"
      }}
    >
      {type && isMobile && (
        <div className={styles.linkContent}>
          <div className={styles.linkTitle}>
            {img && <img className={styles.linkImg} src={img} />}
            <span>Link to {type}</span>
          </div>
        </div>
      )}

      <div className={isMobile ? styles.linkEdit : styles.LinkEditPc}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${styles.linkInput}`}
          onBlur={onBlur}
          placeholder={type ? `Link to ${type}` : ""}
        />
        {isMobile && (
          <span
            onClick={async () => {
              const text = await navigator.clipboard.readText();
              onChange(text);
            }}
            className="button"
            style={{
              fontSize: 12,
              color: isMobile ? "#FBCA04" : "#C9FF5D",
              textDecoration: isMobile ? "none" : "underline"
            }}
          >
            Paste Link
          </span>
        )}
      </div>
    </div>
  );
}
