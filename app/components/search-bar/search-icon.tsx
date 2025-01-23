export default function SearchIcon({
  onClick = () => {},
  size = 18,
  color = "white",
  className = ""
}: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      onClick={onClick}
      className={className}
    >
      <path
        d="M11.6667 11.6366C12.7664 10.508 13.4444 8.96229 13.4444 7.25734C13.4444 3.80151 10.6587 1 7.22222 1C3.78578 1 1 3.80151 1 7.25734C1 10.7132 3.78578 13.5147 7.22222 13.5147C8.96328 13.5147 10.5373 12.7956 11.6667 11.6366ZM11.6667 11.6366L17 17"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}
