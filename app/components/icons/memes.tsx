const TYPES: Record<string, string> = {
  primary: "#FBCA04",
  disabled: "#9290B1"
};

export default function memesIcon({ size = 30, type = "primary" }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 2H6V4H3V6H1V21H3V23H6V25H20V23H23V21H25V6H23V4H20V2ZM20 4V6H23V21H20V23H6V21H3V6H6V4H20ZM10 7H8V11H10V7ZM16 7H18V11H16V7ZM9 17V15H7V17H9ZM17 17V19H9V17H17ZM17 17H19V15H17V17Z"
        fill={TYPES[type]}
      />
    </svg>
  );
}
