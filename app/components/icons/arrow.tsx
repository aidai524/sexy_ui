export default function Arrow() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_b_60_3660)">
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
          id="filter0_b_60_3660"
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
            result="effect1_backgroundBlur_60_3660"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_60_3660"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
