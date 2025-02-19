import styles from "./upload.module.css";

const Empty = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.729646 10.4921C0.181251 10.3932 0.18125 9.60679 0.729644 9.50793L7.82542 8.22879C8.03091 8.19174 8.19174 8.03091 8.22879 7.82542L9.50793 0.729646C9.60679 0.181251 10.3932 0.181251 10.4921 0.729644L11.7712 7.82542C11.8083 8.03091 11.9691 8.19174 12.1746 8.22879L19.2704 9.50793C19.8187 9.60679 19.8187 10.3932 19.2704 10.4921L12.1746 11.7712C11.9691 11.8083 11.8083 11.9691 11.7712 12.1746L10.4921 19.2704C10.3932 19.8187 9.60679 19.8187 9.50793 19.2704L8.22879 12.1746C8.19174 11.9691 8.03091 11.8083 7.82542 11.7712L0.729646 10.4921Z" fill="#9290B1" />
        </svg>
);

export default function UploadBox({ type, onClick, children }: any) {
  if (type === "avatar") {
    return (
      <div className={`${styles.Avatar} ${styles.Center}`} onClick={onClick}>
        {Empty}
      </div>
    );
  }
  if (type === "token") {
    return (
      <div className={`${styles.Token} ${styles.Center}`} onClick={onClick}>
        {Empty}
      </div>
    );
  }
  if (type === "banner") {
    return (
      <div
        className={`${styles.Banner} ${styles.BannerDefault} ${styles.Center}`}
      >
        <button className={`${styles.BannerButton} button`} onClick={onClick}>
          Change
        </button>
      </div>
    );
  }
  return (
    <div
      className={`${styles.Others} ${styles.Center} button`}
      onClick={onClick}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25 3H3L3 22.6667L14.4258 13.1452C15.9152 11.904 18.0802 11.9096 19.5631 13.1584L25 17.7368V3ZM3 0C1.34315 0 0 1.34315 0 3V25C0 26.6569 1.34315 28 3 28H25C26.6569 28 28 26.6569 28 25V3C28 1.34315 26.6569 0 25 0H3ZM7.5 11C8.88071 11 10 9.88071 10 8.5C10 7.11929 8.88071 6 7.5 6C6.11929 6 5 7.11929 5 8.5C5 9.88071 6.11929 11 7.5 11Z"
          fill="#9290B1"
          fillOpacity="0.6"
        />
      </svg>
    </div>
  );
}
