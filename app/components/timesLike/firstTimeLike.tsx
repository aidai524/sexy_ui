import type { Project } from "@/app/type";
import styles from "./index.module.css";

interface Props {
  data: Project;
  onClose: () => void;
  onShare: (data: Project) => void;
}

export const FIRST_LIKE_TIMES = 10;

export default function FirstTimeLike({ data, onClose, onShare }: Props) {

  return (
    <div className={styles.main + ' ' + styles.firstTimeLike}>
      <div className={styles.content}>
        <div className={styles.text}>
          {'You’ve liked 10 times.'} <br />
          Now try to <strong>Share</strong> a meme token on X, <br />
          and mining <strong>10 $FUN</strong>
        </div>
      </div>

      <div className={styles.actionBox}>
        <div
          className={`${styles.cancel} button`}
          onClick={() => {
            onClose && onClose();
          }}
        >
          Later
        </div>
        <div className={`${styles.shareBox} button`} onClick={() => {
          onShare(data);
        }}>
          <div className={styles.shareText}>Share Now </div>
          <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b_6578_12140)">
              <circle cx="29.5" cy="29.5" r="26.5" fill="black" fill-opacity="0.4" />
              <circle cx="29.5" cy="29.5" r="28" stroke="#FBCA04" stroke-opacity="0.3" stroke-width="3" />
            </g>
            <g filter="url(#filter1_b_6578_12140)">
              <circle cx="29.5" cy="29.5" r="21.5" fill="black" fill-opacity="0.4" />
              <circle cx="29.5" cy="29.5" r="22.5" stroke="#FBCA04" stroke-width="2" />
            </g>
            <g filter="url(#filter2_d_6578_12140)">
              <path d="M31.4591 36.2483C31.439 36.3873 31.4524 36.529 31.4984 36.6622C31.5443 36.7953 31.6215 36.9164 31.7239 37.0159L31.7321 37.0221C31.8213 37.1124 31.9285 37.1843 32.0472 37.2335C32.1659 37.2827 32.2936 37.3082 32.4227 37.3084C32.7233 37.3084 32.98 37.1669 33.1572 36.9608L42.7218 26.8534C42.8172 26.7612 42.8912 26.6504 42.9388 26.5283C42.9865 26.4063 43.0066 26.2758 42.998 26.1456C43.0067 26.0153 42.9866 25.8848 42.939 25.7627C42.8913 25.6407 42.8173 25.5299 42.7218 25.4378L33.1035 15.2737C32.9193 15.0983 32.6713 15 32.4129 15C32.1545 15 31.9065 15.0983 31.7223 15.2737C31.6204 15.3734 31.5436 15.4946 31.498 15.6277C31.4523 15.7608 31.439 15.9024 31.4591 16.0413V21.515C23.4739 21.515 17 27.7531 17 35.4508C16.9995 37.3609 17.4078 39.2503 18.1992 41C19.34 35.196 25.0892 30.7872 31.4428 30.7872L31.4591 36.2483Z" fill="white" />
            </g>
            <defs>
              <filter id="filter0_b_6578_12140" x="-10" y="-10" width="79" height="79" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_6578_12140" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_6578_12140" result="shape" />
              </filter>
              <filter id="filter1_b_6578_12140" x="-4" y="-4" width="67" height="67" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_6578_12140" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_6578_12140" result="shape" />
              </filter>
              <filter id="filter2_d_6578_12140" x="13" y="11" width="34" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6578_12140" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6578_12140" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
