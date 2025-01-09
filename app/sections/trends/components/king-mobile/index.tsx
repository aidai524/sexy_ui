import styles from "./index.module.css";
import { useTrends } from "@/app/sections/trends/hooks";
import { useRouter } from "next/navigation";

export default function King() {
  const { top1 } = useTrends({ isPolling: true });
  const router = useRouter();

  return (
    top1 && (
      <div
        className={`${styles.Avatar} button`}
        style={{ backgroundImage: `url("${top1?.Icon}")` }}
        onClick={() => {
          router.push(`/detail?address=${top1?.address}`);
        }}
      >
        <img
          src="/img/trends/crown-laptop.svg"
          alt=""
          className={styles.Crown}
        />
      </div>
    )
  );
}
