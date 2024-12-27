import { shareToX } from "@/app/utils/share";
import styles from "./likes.module.css";
import type { Project } from "@/app/type";

export default function Likes({ data }: { data: Project }) {
  return (
    <div className={styles.box}>
      <div className={styles.likeNums}>
        {data.DApp === "pump" && (
          <div className={[styles.pump, styles.likeCustom].join(" ")}>
            <PumpIcon />
            <span className={styles.likesNums}>Imported</span>
          </div>
        )}

        {data.DApp === "sexy" && !data.initiativeLaunching && (
          <>
            <div className={[styles.likes, styles.likeCustom].join(" ")}>
              {data.like === 0 ? <LikeIconEmpty /> : <LikeIcon />}
              <span className={styles.likesNums}>{data.like}</span>/
              <span className={styles.likesNums}>100</span>
            </div>
            <div className={[styles.superLikes, styles.likeCustom].join(" ")}>
              <SuperLikeIcon />
              <span className={styles.tips}>
                Smoky
                <br />
                HOT
              </span>
              <span className={styles.likesNums}>{data.prePaid}</span>
            </div>
          </>
        )}

        <div className={[styles.holder, styles.likeCustom].join(" ")}>
          <span className={styles.likesNums}>Holders 0</span>
        </div>
      </div>

      <div
        className={styles.share}
        onClick={() => {
          shareToX(
            data.tokenName,
            "https://app.flipn.fun/detail?id=" + data.id
          );
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_b_4443_336)">
            <circle cx="20" cy="20" r="20" fill="black" fill-opacity="0.4" />
          </g>
          <circle
            cx="25.7727"
            cy="13.8636"
            r="2.86364"
            stroke="white"
            stroke-width="2"
          />
          <circle
            cx="25.7727"
            cy="26.1366"
            r="2.86364"
            stroke="white"
            stroke-width="2"
          />
          <circle cx="13.0908" cy="20.0001" r="4.09091" fill="white" />
          <path
            d="M23.3181 15.0908L13.9091 19.9999L23.3181 24.909"
            stroke="white"
            stroke-width="2"
          />
          <defs>
            <filter
              id="filter0_b_4443_336"
              x="-10"
              y="-10"
              width="60"
              height="60"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_4443_336"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_4443_336"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function LikeIcon() {
  return (
    <svg
      width="13"
      height="11"
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.4122 0C1.5277 0 0 1.48403 0 3.31465C0 6.6293 4.0326 9.64262 6.20401 10.3436C8.37541 9.64262 12.408 6.6293 12.408 3.31465C12.408 1.48403 10.8803 0 8.99581 0C7.84177 0 6.82152 0.55653 6.20401 1.40837C5.58649 0.55653 4.56624 0 3.4122 0Z"
        fill="white"
        fill-opacity="0.5"
      />
      <path
        d="M4.653 3.10349C4.653 3.10349 0 1.48458 0 3.31521C0 6.62986 4.0326 9.64317 6.20401 10.3441C8.37541 9.64317 12.408 6.62986 12.408 3.31521C9.30601 4.65489 6.72101 3.62067 4.653 3.10349Z"
        fill="white"
      />
    </svg>
  );
}

function LikeIconEmpty() {
  return (
    <svg
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.02402 0.903809C2.13951 0.903809 0.611816 2.38784 0.611816 4.21846C0.611816 7.53311 4.64442 10.5464 6.81582 11.2474C8.98722 10.5464 13.0198 7.53311 13.0198 4.21846C13.0198 2.38784 11.4921 0.903809 9.60762 0.903809C8.45359 0.903809 7.43334 1.46034 6.81582 2.31217C6.19831 1.46034 5.17806 0.903809 4.02402 0.903809Z"
        fill="white"
        fill-opacity="0.5"
      />
    </svg>
  );
}

function SuperLikeIcon() {
  return (
    <svg
      width="15"
      height="18"
      viewBox="0 0 15 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.00698843 10.0413C-0.0827662 8.69489 0.675021 5.93592 3.26876 4.23536C3.43111 4.12891 3.64428 4.23625 3.67429 4.42806C3.82387 5.38418 4.12114 6.005 4.64184 6.51773C4.71234 6.58715 4.81727 6.60709 4.90957 6.57146C6.95857 5.78056 8.55436 4.18907 7.98871 0.309155C7.95749 0.095019 8.17261 -0.0723279 8.36235 0.0317295C10.6995 1.31347 14.7939 5.03332 14.7313 10.0413C14.7313 15.7302 10.0463 17.6712 7.23531 17.6712C4.42429 17.6712 0.00698843 15.4625 0.00698843 10.0413ZM3.08893 9.07205C2.7814 9.53528 2.61713 10.081 2.61714 10.6394C2.61678 11.0452 2.70337 11.4461 2.87091 11.8146C3.03846 12.183 3.28296 12.5102 3.58749 12.7734L6.63824 15.4907C6.80781 15.6417 7.02486 15.7266 7.25054 15.7302C7.47621 15.7338 7.69578 15.6559 7.86995 15.5103L11.0021 12.8932C11.35 12.633 11.6326 12.2933 11.827 11.9018C12.0214 11.5102 12.1221 11.0778 12.121 10.6394C12.1211 10.081 11.9568 9.53528 11.6493 9.07205C11.3417 8.60882 10.9049 8.24914 10.3947 8.03902C9.88446 7.82889 9.32401 7.77788 8.78504 7.89251C8.42817 7.9684 8.09145 8.11463 7.79319 8.32098C7.54283 8.4942 7.19536 8.4942 6.94499 8.32098C6.64673 8.11463 6.31001 7.9684 5.95314 7.89251C5.41417 7.77788 4.85372 7.82889 4.3435 8.03902C3.83327 8.24914 3.39645 8.60882 3.08893 9.07205ZM6.02954 10.1452C6.14582 10.0842 6.2713 10.2097 6.21027 10.326L5.8961 10.9246C5.87566 10.9635 5.87566 11.0101 5.8961 11.049L6.21027 11.6476C6.2713 11.7639 6.14582 11.8894 6.02954 11.8284L5.43092 11.5142C5.39197 11.4937 5.34546 11.4937 5.30651 11.5142L4.70789 11.8284C4.59161 11.8894 4.46614 11.7639 4.52716 11.6476L4.84133 11.049C4.86177 11.0101 4.86177 10.9635 4.84133 10.9246L4.52716 10.326C4.46614 10.2097 4.59161 10.0842 4.70789 10.1452L5.30651 10.4594C5.34546 10.4799 5.39197 10.4799 5.43092 10.4594L6.02954 10.1452ZM10.36 10.326C10.4211 10.2097 10.2956 10.0842 10.1793 10.1452L9.58069 10.4594C9.54174 10.4799 9.49523 10.4799 9.45628 10.4594L8.85766 10.1452C8.74138 10.0842 8.6159 10.2097 8.67693 10.326L8.9911 10.9246C9.01154 10.9635 9.01154 11.0101 8.9911 11.049L8.67693 11.6476C8.6159 11.7639 8.74138 11.8894 8.85766 11.8284L9.45628 11.5142C9.49523 11.4937 9.54174 11.4937 9.58069 11.5142L10.1793 11.8284C10.2956 11.8894 10.4211 11.7639 10.36 11.6476L10.0459 11.049C10.0254 11.0101 10.0254 10.9635 10.0459 10.9246L10.36 10.326Z"
        fill="white"
      />
    </svg>
  );
}

function PumpIcon() {
  return <img className={styles.punmIcon} src="/img/home/pump.png" />;
}
