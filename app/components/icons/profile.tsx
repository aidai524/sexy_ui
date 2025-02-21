const TYPES: Record<string, string> = {
  primary: "#FBCA04",
  disabled: "#9290B1"
};

export default function Profile({ size = 30, type = "primary" }: any) {
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
        d="M18.322 16.226C20.7977 15.0009 22.5 12.4493 22.5 9.5C22.5 5.35786 19.1421 2 15 2C10.8579 2 7.5 5.35786 7.5 9.5C7.5 12.4493 9.20232 15.0009 11.678 16.226C7.287 17.1869 4 21.0985 4 25.7778C4 26.4528 4.54721 27 5.22222 27H24.7778C25.4528 27 26 26.4528 26 25.7778C26 21.0985 22.713 17.1869 18.322 16.226Z"
        fill={TYPES[type]}
      />
    </svg>
  );
}
