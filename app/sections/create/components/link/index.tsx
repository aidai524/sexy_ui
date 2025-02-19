import { useUserAgent } from "@/app/context/user-agent";
import styles from "./link.module.css";

interface Props {
  type?: string;
  img?: string;
  value: string;
  isLink?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  onDelete: () => void;
  hideDelete?: boolean;
}

export default function Link({ type, img, value, isLink = true, onChange, onBlur, onDelete, hideDelete = false }: Props) {
  const { isMobile } = useUserAgent();
  return (
    <div
      className={styles.linkBox}
      style={{
        // backgroundColor: isMobile ? "rgba(18, 23, 25, 1)" : "transparent",
        padding: isMobile ? "0 0 10px" : "0px"
      }}
    >
      {type && isMobile && (
        <div className={styles.linkContent}>
          <div className={styles.linkTitle}>
            {img && <img className={styles.linkImg} src={img} />}
            {
              isLink ? (
                <span className={styles.linkTitleText}>Link to {type}</span>
              ) : (
                <span className={styles.linkTitleText}>{type}</span>
              )
            }
            <div className={styles.linkTitleDesc}>
              Optional
            </div>
          </div>

          {!hideDelete && (
            <div onClick={onDelete}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="15" fill="#21252E" />
              <path d="M16.8723 9.37201H14.2723C14.0931 9.37201 13.9402 9.43613 13.8124 9.56642C13.6858 9.69671 13.6221 9.85417 13.6221 10.039V10.704H17.5222V10.039C17.5222 9.85417 17.4581 9.69671 17.3317 9.56642C17.2041 9.43613 17.0513 9.37201 16.8715 9.37201H16.8723ZM19.4721 20.0372V12.0379H11.6718V20.0374C11.6718 20.2201 11.7357 20.3776 11.8623 20.5079C11.99 20.6382 12.143 20.7043 12.3223 20.7043H18.8221C19.0014 20.7043 19.155 20.6382 19.2814 20.5079C19.4092 20.3776 19.4723 20.2201 19.4723 20.0373H19.472L19.4721 20.0372ZM14.2721 8.03809H16.8715C17.4098 8.03809 17.8696 8.2325 18.2505 8.62329C18.6311 9.01417 18.8217 9.48475 18.8217 10.037V10.7039H21.4215C21.6008 10.7039 21.7544 10.77 21.8809 10.8984C22.0084 11.0305 22.0718 11.1861 22.0718 11.3708C22.0718 11.5556 22.0084 11.7111 21.8809 11.8434C21.7544 11.9717 21.6009 12.0378 21.4215 12.0378H20.7715V20.0373C20.7715 20.5895 20.5811 21.06 20.2005 21.4508C19.8196 21.8417 19.3596 22.0381 18.8217 22.0381H12.3221C11.7836 22.0381 11.3241 21.8417 10.9432 21.4508C10.5623 21.06 10.3721 20.5895 10.3721 20.0373V12.0377H9.72205C9.54278 12.0377 9.38996 11.9716 9.26232 11.8433C9.1355 11.7111 9.07178 11.5555 9.07178 11.3708C9.07178 11.1861 9.13541 11.0306 9.26232 10.8984C9.38996 10.77 9.54278 10.7039 9.72205 10.7039H12.3221V10.037C12.3221 9.48475 12.5124 9.01417 12.8932 8.62338C13.274 8.2325 13.7333 8.03809 14.2721 8.03809Z" fill="white" />
              </svg>
            </div>
          )}
        </div>
      )}

      <div className={isMobile ? styles.linkEdit : styles.LinkEditPc}>
        {img && !isMobile && <img className={styles.linkImg} src={img} />}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${styles.linkInput}`}
          onBlur={onBlur}
          placeholder={type ? `Link to ${type}` : ""}
        />
        {/* {isMobile && (
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
        )} */}
      </div>
    </div>
  );
}
