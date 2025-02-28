export default function XButton({ onClick }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      className="button"
      onClick={onClick}
    >
      <rect opacity="0.1" width="30" height="30" rx="6" fill="white" />
      <path
        d="M17.119 13.1992L23.4486 6H21.9492L16.4509 12.2497L12.0626 6H7L13.6374 15.4515L7 23H8.4994L14.3021 16.3987L18.9374 23H24M9.04057 7.10634H11.3441L21.9481 21.948H19.644"
        fill="#D9D9D9"
      />
    </svg>
  );
}
