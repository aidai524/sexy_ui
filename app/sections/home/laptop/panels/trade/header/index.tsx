import styles from "./index.module.css";
import Tabs from "@/app/components/tabs";

export default function Header({ tabs, onClose, ...rest }: any) {
  return (
    <div className={styles.Container}>
      <Tabs {...rest} tabs={tabs} />
      <button className="button" onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="17"
          viewBox="0 0 18 17"
          fill="none"
        >
          <path
            d="M1.85645 10.7407H7.06531V15.9496"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16.0923 6.20898H10.8834V1.00012"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
