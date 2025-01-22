export default function ItemCloseIcon({ onClick }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      onClick={onClick}
      className="button"
      style={{
        padding: 5,
        width: 20,
        height: 20
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.07888 4.67369L1.49441 0L0.386846 1.12913L4.97131 5.80281L0 10.8709L1.10757 12L6.07888 6.93194L10.8925 11.8392L12 10.7101L7.18645 5.80281L11.6132 1.28993L10.5056 0.160803L6.07888 4.67369Z"
        fill="#515B63"
      />
    </svg>
  );
}
