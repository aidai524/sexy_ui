export default function ScaleButton({ onClick }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      className="button"
      onClick={onClick}
      style={{
        marginBottom: 20,
        position: "absolute",
        top: 0,
        right: -50,
        zIndex: 35
      }}
    >
      <path
        d="M42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0C32.598 0 42 9.40202 42 21Z"
        fill="white"
        fillOpacity="0.1"
      />
      <path
        d="M22.0049 27.3872H14.6682V20.0506"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20.0459 13.6685H27.3825V21.0051"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
