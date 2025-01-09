export default function Bg({ className }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 359 80"
      fill="none"
      className={className}
    >
      <path
        d="M14 1C6.8203 1 1 6.8203 1 14V66C1 73.1797 6.82029 79 14 79H345C352.18 79 358 73.1797 358 66V14C358 6.8203 352.18 1 345 1H14Z"
        fill="url(#paint0_radial_5817_1617)"
        fillOpacity="0.8"
        stroke="url(#paint1_linear_5817_1617)"
        strokeWidth="2"
      />
      <defs>
        <radialGradient
          id="paint0_radial_5817_1617"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(226 97) rotate(-120.75) scale(91.9239 155.782)"
        >
          <stop stopColor="#FF24AB" />
          <stop offset="1" stopColor="#0C0106" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_5817_1617"
          x1="179.5"
          y1="2"
          x2="179.5"
          y2="78"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF2681" />
          <stop offset="1" stopColor="#FF91BF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
