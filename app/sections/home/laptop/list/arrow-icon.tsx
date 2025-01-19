export default function ArrowIcon({ isDown, disabled, onClick }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      className={!disabled ? "button" : ""}
      onClick={onClick}
      style={{
        transform: `rotate(${isDown ? 180 : 0}deg)`,
        opacity: disabled ? 0.5 : 1
      }}
    >
      <circle cx="25" cy="25" r="25" fill="white" fillOpacity="0.1" />
      <path
        d="M25 33V15.5M25 15.5L19 21.5M25 15.5L31 21.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
