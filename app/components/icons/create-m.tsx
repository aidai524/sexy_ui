const TYPES: Record<string, string> = {
  primary: "#FBCA04",
  disabled: "#9290B1"
};

export default function Create({ size = 30, type = "primary" }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 0.8125}
      viewBox="0 0 30 30"
      fill="none"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="24"
        rx="7"
        stroke={TYPES[type]}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.0344 6.58632C15.3001 5.59964 16.6999 5.59964 16.9656 6.58632L17.9716 10.3227C18.0643 10.6669 18.3331 10.9357 18.6773 11.0284L22.4137 12.0344C23.4004 12.3001 23.4004 13.6999 22.4137 13.9656L18.6773 14.9716C18.3331 15.0643 18.0643 15.3331 17.9716 15.6773L16.9656 19.4137C16.6999 20.4004 15.3001 20.4004 15.0344 19.4137L14.0284 15.6773C13.9357 15.3331 13.6669 15.0643 13.3227 14.9716L9.58632 13.9656C8.59964 13.6999 8.59964 12.3001 9.58632 12.0344L13.3227 11.0284C13.6669 10.9357 13.9357 10.6669 14.0284 10.3227L15.0344 6.58632Z"
        fill={TYPES[type]}
      />
    </svg>
  );
}
