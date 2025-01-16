export default function DetailButton({ onClick }: any) {
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
        marginBottom: 20
      }}
    >
      <path
        d="M42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0C32.598 0 42 9.40202 42 21Z"
        fill="white"
        fillOpacity="0.1"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 20.5C15 21.8807 13.8807 23 12.5 23C11.1193 23 10 21.8807 10 20.5C10 19.1193 11.1193 18 12.5 18C13.8807 18 15 19.1193 15 20.5ZM24 20.5C24 21.8807 22.8807 23 21.5 23C20.1193 23 19 21.8807 19 20.5C19 19.1193 20.1193 18 21.5 18C22.8807 18 24 19.1193 24 20.5ZM30.5 23C31.8807 23 33 21.8807 33 20.5C33 19.1193 31.8807 18 30.5 18C29.1193 18 28 19.1193 28 20.5C28 21.8807 29.1193 23 30.5 23Z"
        fill="white"
      />
    </svg>
  );
}
