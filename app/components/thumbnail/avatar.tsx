import { useRouter } from "next/navigation";
import AvatarBox from "./avatar-box";
import type { Project } from "@/app/type";
import styles from "./avatar.module.css";

export function Avatar({
  data,
  showBackIcon = false,
  showLaunchType = true,
  showTicker = true
}: any) {
  const route = useRouter();

  if (!data) {
    return;
  }

  return (
    <div className={styles.titles}>
      <AvatarBox data={data} showTicker={showTicker} showLaunchType={showLaunchType} />
      {showBackIcon && (
        <div
          onClick={() => {
            route.push("/detail?address=" + data.address);
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_b_610_8930)">
              <circle cx="16" cy="16" r="16" fill="black" fillOpacity="0.4" />
            </g>
            <path
              d="M9 13L15.5 19L22 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <filter
                id="filter0_b_610_8930"
                x="-10"
                y="-10"
                width="52"
                height="52"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_610_8930"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_610_8930"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
}

export function AvatarBack({
  data,
  showBackIcon = true,
  showLaunchType,
  showTokenName = true,
  onBack
}: any) {
  return (
    <div className={styles.detailTitle}>
      <Avatar data={data} showLaunchType={showLaunchType} showTokenName={showTokenName} />
      {showBackIcon && <TopArrow onBack={onBack} />}
    </div>
  );
}

function TopArrow({ onBack }: any) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        onBack ? onBack() : router.back();
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_b_1_1274)">
          <circle cx="20" cy="20" r="20" fill="black" fillOpacity="0.4" />
        </g>
        <path
          d="M14 22L20.5 16L27 22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <filter
            id="filter0_b_1_1274"
            x="-10"
            y="-10"
            width="60"
            height="60"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1_1274"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1_1274"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
