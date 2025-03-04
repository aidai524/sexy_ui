export default function LikeIcon({ isActive, size = 32 }: any) {
  const id = String(Math.random() + Date.now());
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={0.875 * size}
      viewBox="0 0 32 28"
      fill="none"
    >
      <g filter={`url(#${id})`}>
        <path
          d="M4.21564 8.50936C2.40685 15.5166 12.4697 22.8527 16.0071 24C21.9029 21.7052 29.3209 14.4045 27.7986 8.50924C26.0076 1.57316 18.6602 3.9192 16.0071 7.07465C14.2384 4.2059 6.00607 1.57329 4.21564 8.50936Z"
          fill={isActive ? "#FF2681" : "#fff"}
        />
      </g>
      <defs>
        <filter
          id={id}
          x="0"
          y="0"
          width="32"
          height="28"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_8184_79"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_8184_79"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
