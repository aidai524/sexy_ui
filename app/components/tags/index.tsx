import type { Project } from "@/app/type";
import styles from "./tags.module.css";
import { formatAddress, simplifyNum, timeAgo } from "@/app/utils";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import useMc from "@/app/hooks/useMc";

interface Props {
  data: Project;
}

export default function Tags({ data }: Props) {
  const router = useRouter();
  const [mc, setMc] = useState(0);

  const { mc: pumpMc } = useMc({
    tokenAddress: data.address,
    disable: data.DApp !== "pump"
  });

  const userName = useMemo(() => {
    if (data.creater) {
      if (data.creater.name) {
        return data.creater.name;
      }

      if (data.creater.address) {
        return formatAddress(data.creater.address);
      }
    }

    if (data.account) {
      return formatAddress(data.account);
    }
    return "-";
  }, [data]);

  const { getMC } = useTokenTrade({
    tokenName: data.tokenName,
    tokenSymbol: data.tokenSymbol as string,
    tokenDecimals: data.tokenDecimals as number,
    loadData: false
  });

  useEffect(() => {
    if (data && data.DApp === "sexy" && data.status === 1) {
      getMC().then((res) => {
        if (!isNaN(Number(res))) {
          setMc(Number(res));
        }
      });
    }
  }, [data]);

  return (
    <>
      {data.DApp === "sexy" && mc > 0 && (
        <div className={styles.Item}>
          <Tag>
            <span className={styles.mc}>Market Cap: ${simplifyNum(mc, 2)}</span>
          </Tag>
        </div>
      )}
      {data.DApp === "pump" && pumpMc > 0 && (
        <div className={styles.Item}>
          <Tag>
            <span className={styles.mc}>
              Market Cap: ${simplifyNum(pumpMc, 2)}
            </span>
          </Tag>
        </div>
      )}
      <div className={styles.tags}>
        {data.account && (
          <Tag
            onClick={() => {
              router.push("/profile/user?account=" + data.account);
            }}
          >
            <span>Created by</span>{" "}
            <span className={styles.userName}>{userName}</span>
            {data.time && (
              <span
                style={{
                  marginLeft: 5
                }}
              >
                {" "}
                {timeAgo(data.time)}
              </span>
            )}
          </Tag>
        {data.account && (
          <Tag
            onClick={() => {
              router.push("/profile/user?account=" + data.account);
            }}
          >
            <span>Created by</span>{" "}
            <span className={styles.userName}>{userName}</span>
            {data.time && (
              <span
                style={{
                  marginLeft: 5
                }}
              >
                {" "}
                {timeAgo(data.time)}
              </span>
            )}
          </Tag>
        )}
      </div>
    </>
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
