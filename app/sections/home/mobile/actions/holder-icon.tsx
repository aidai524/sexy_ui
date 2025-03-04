export default function Holder({ size = 27 }: any) {
  const id = String(Math.random() + Date.now());
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={1.1111111111111112 * size}
      viewBox="0 0 27 30"
      fill="none"
    >
      <g filter={`url(#${id})`}>
        <path
          d="M16.9479 15.0456V14.643C18.4012 13.5747 19.3469 11.838 19.3469 9.87595C19.3469 6.63038 16.7613 4 13.571 4C10.3806 4 7.79505 6.63038 7.79505 9.87595C7.79505 11.838 8.7407 13.5747 10.194 14.643V14.9899C6.58065 16.4152 4.00003 20.1063 4.00003 24.4228C4.00003 25.2937 4.86355 26 5.92865 26H21.0714C22.1365 26 23 25.2937 23 24.4228C23.0025 20.162 20.4891 16.5114 16.9479 15.0456Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id={id}
          x="0"
          y="0"
          width="27"
          height="30"
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
            result="effect1_dropShadow_8274_6722"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_8274_6722"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
