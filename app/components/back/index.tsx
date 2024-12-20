import { useRouter } from "next/navigation";
import styles from "./back.module.css";

interface Props {
  style?: any;
}

export default function Back({ style = {} }: Props) {
  const router = useRouter();

  return (
    <div
      className={styles.main}
      style={style}
      onClick={() => {
        router.back();
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_b_17_2980)">
          <circle cx="20" cy="20" r="20" fill="black" fill-opacity="0.4" />
        </g>
        <path
          d="M23.5 25.5L17.5 19L23.5 12.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <filter
            id="filter0_b_17_2980"
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
              result="effect1_backgroundBlur_17_2980"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_17_2980"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
