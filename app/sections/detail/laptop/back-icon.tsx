export default function BackIcon({ onClick }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      className="button"
      onClick={onClick}
    >
      <circle cx="21" cy="21" r="21" fill="white" fill-opacity="0.1" />
      <path
        d="M23.5195 26.8799L18.4795 21.8399L23.5195 16.7999"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
