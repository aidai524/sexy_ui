import styles from "./index.module.css";

export default function Address({ address }: any) {
  return (
    <div
      className={styles.addressContent}
      onClick={() => {
        window.open(`https://solscan.io/account/${address}?cluster=devnet`);
      }}
    >
      <div>{address}</div>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 1C7.5 0.723858 7.27614 0.5 7 0.5L2.5 0.500001C2.22386 0.5 2 0.723858 2 1C2 1.27614 2.22386 1.5 2.5 1.5L6.5 1.5L6.5 5.5C6.5 5.77614 6.72386 6 7 6C7.27614 6 7.5 5.77614 7.5 5.5L7.5 1ZM1.35355 7.35355L7.35355 1.35355L6.64645 0.646447L0.646447 6.64645L1.35355 7.35355Z" fill="#7E8A93" />
      </svg>
    </div>
  );
}
