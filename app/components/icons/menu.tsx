export default function MenuIcon({ theme = "light" }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="29"
      viewBox="0 0 30 29"
      fill="none"
    >
      <g filter="url(#filter0_d_6033_281)">
        <rect
          x="4"
          y="4"
          width="22"
          height="3"
          fill={theme === "dark" ? "#000" : "#fff"}
        />
        <rect
          x="4"
          y="13"
          width="22"
          height="3"
          fill={theme === "dark" ? "#000" : "#fff"}
        />
        <rect
          x="4"
          y="22"
          width="22"
          height="3"
          fill={theme === "dark" ? "#000" : "#fff"}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_6033_281"
          x="0"
          y="0"
          width="30"
          height="29"
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
            result="effect1_dropShadow_6033_281"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_6033_281"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
