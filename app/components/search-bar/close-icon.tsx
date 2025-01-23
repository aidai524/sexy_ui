export default function CloseIcon({ onClick }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      onClick={onClick}
    >
      <circle cx="10" cy="10" r="10" fill="#3B3B3B" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0657 8.89482L6.24534 5L5.32236 5.94096L9.14272 9.83578L5 14.0592L5.92297 15.0002L10.0657 10.7767L14.077 14.8663L15 13.9253L10.9887 9.83578L14.6776 6.07492L13.7547 5.13395L10.0657 8.89482Z"
        fill="white"
      />
    </svg>
  );
}
