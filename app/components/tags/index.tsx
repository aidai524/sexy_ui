import type { Project } from "@/app/type";
import styles from "./tags.module.css";
import { formatAddress, timeAgo } from "@/app/utils";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface Props {
  data: Project;
}

export default function Tags({ data }: Props) {
  const router = useRouter();
  const userName = useMemo(() => {
    if (data.creater) {
      return data.creater.name || formatAddress(data.creater.address);
    }

    if (data.account) {
      return formatAddress(data.account);
    }
    return "-";
  }, [data]);

  return (
    <div className={styles.tags}>
      <Tag>Created in {data.time ? timeAgo(data.time) : 0}</Tag>
      <Tag
        onClick={() => {
          router.push("/profile/user?account=" + data.account);
        }}
      >
        <span>Created by</span>{" "}
        <span className={styles.userName}>{userName}</span>
      </Tag>
    </div>
  );
}

function Tag({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={() => {
        onClick && onClick();
      }}
      className={`${styles.tag} button`}
    >
      {" "}
      {children}
    </div>
  );
}
