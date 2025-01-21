import styles from "./limitProject.module.css";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useRouter } from "next/navigation";

export default function LimitProject({ list = [] }: any) {
  const homeTabStore: any = useHomeTab();
  const router = useRouter();
  return !!list.length ? (
    <div
      className={`${styles.main} button`}
      onClick={() => {
        homeTabStore.set({
          currentSummary: { label: "Launched", amount: 0, value: 3 },
          profileTabName: "Liked"
        });
        router.push("/profile");
      }}
    >
      {list?.slice(0, 5).map((item: any) => {
        return <img className={styles.img} key={item.id} src={item.icon} />;
      })}
      {(!list || list?.length === 0) && <span>-</span>}
      {list?.length > 5 && (
        <div className={styles.more}>{list.length - 5}+</div>
      )}
    </div>
  ) : (
    "-"
  );
}
