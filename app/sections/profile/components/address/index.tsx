import { useAccount } from "@/app/hooks/useAccount";
import styles from "./index.module.css";
import { formatAddressLast, logOut } from "@/app/utils";
import { useRouter } from "next/navigation";

export default function Address({
  address,
  color = "rgba(126, 138, 147, 1)",
  fontSize = 10,
  style
}: any) {
  const { disconnect, address: loginAddress } = useAccount();
  const router = useRouter();

  return (
    <div className={styles.main} style={style}>
      <div
        className={styles.addressContent}
        style={{ color, fontSize }}
        onClick={() => {
          window.open(`https://solscan.io/account/${address}?cluster=devnet`);
        }}
      >
        <div>{formatAddressLast(address)}</div>
        <svg
          width={fontSize}
          height={fontSize}
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 1C7.5 0.723858 7.27614 0.5 7 0.5L2.5 0.500001C2.22386 0.5 2 0.723858 2 1C2 1.27614 2.22386 1.5 2.5 1.5L6.5 1.5L6.5 5.5C6.5 5.77614 6.72386 6 7 6C7.27614 6 7.5 5.77614 7.5 5.5L7.5 1ZM1.35355 7.35355L7.35355 1.35355L6.64645 0.646447L0.646447 6.64645L1.35355 7.35355Z"
            fill={color}
          />
        </svg>
      </div>

      {loginAddress === address && (
        <div
          onClick={async () => {
            await disconnect();
            logOut();
            router.push("/");
          }}
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38 19C38 8.50659 29.4934 0 19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38C29.4934 38 38 29.4934 38 19Z"
              fill="white"
              fill-opacity="0.08"
            />
            <path
              d="M22.8001 11.3999H12.6667V26.5999H22.8001"
              stroke="white"
              strokeWidth="2"
            />
            <path d="M19 19H25.3333" stroke="white" strokeWidth="2" />
            <path
              d="M29.1333 19L25.3333 23.3879L25.3333 14.6122L29.1333 19Z"
              fill="white"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
