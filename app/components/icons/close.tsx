export default function Close({ size = 22 }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
    >
      <path d="M1 1L21 21" stroke="#716C7C" strokeWidth="2" />
      <path d="M21 1L1 21" stroke="#716C7C" strokeWidth="2" />
    </svg>
  );
}
