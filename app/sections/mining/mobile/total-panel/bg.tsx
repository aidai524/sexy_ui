import { useUserAgent } from "@/app/context/user-agent";

export default function Bg({ className }: any) {
  const { isMobile } = useUserAgent();
  return isMobile ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="343"
      height="80"
      viewBox="0 0 343 80"
      fill="none"
      className={className}
    >
      <path
        d="M14 1C6.8203 1 1 6.8203 1 14V66C1 73.1797 6.8203 79 14 79H329C336.18 79 342 73.1797 342 66V14C342 6.8203 336.18 1 329 1H14Z"
        fill="url(#paint0_radial_6186_279)"
        fillOpacity="0.8"
        stroke="url(#paint1_linear_6186_279)"
        strokeWidth="2"
      />
      <defs>
        <radialGradient
          id="paint0_radial_6186_279"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(215.904 97) rotate(-119.602) scale(90.859 150.504)"
        >
          <stop stopColor="#8F7300" />
          <stop offset="1" stopColor="#0C0106" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_6186_279"
          x1="135.69"
          y1="-1.5"
          x2="174.281"
          y2="76.6261"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FBCA04" />
          <stop offset="1" stopColor="#A578FF" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="664"
      height="116"
      viewBox="0 0 664 116"
      fill="none"
      className={className}
    >
      <path
        d="M1 12C1 5.92487 5.92487 1 12 1H652C658.075 1 663 5.92487 663 12V104C663 110.075 658.075 115 652 115H12C5.92488 115 1 110.075 1 104V12Z"
        fill="url(#paint0_radial_6578_10554)"
        fillOpacity="0.8"
        stroke="url(#paint1_linear_6578_10554)"
        strokeWidth="2"
      />
      <defs>
        <radialGradient
          id="paint0_radial_6578_10554"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(418.975 145) rotate(-126.094) scale(149.223 273.964)"
        >
          <stop stopColor="#8F7300" />
          <stop offset="1" stopColor="#0C0106" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_6578_10554"
          x1="261.859"
          y1="-5.3421"
          x2="311.59"
          y2="123.856"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FBCA04" />
          <stop offset="1" stopColor="#A578FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
