import styles from "./index.module.css";
import tabs, { tabsPath } from "./config";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "@/app/hooks/useAccount";
import CopyTrade from "@/app/services/copyTrade";
import { useEffect, useState } from "react";

export default function Tabs() {
  const pathname = usePathname();
  const router = useRouter();
  const { address: sexAddress } = useAccount();
  const copyTradeService = new CopyTrade();
  const [copyTradeUserInfo, setCopyTradeUserInfo] = useState<any>(null);
  const canClaim =
    Number(copyTradeUserInfo?.carryFee || "0") -
    Number(copyTradeUserInfo?.claimed || "0");
  useEffect(() => {
    if (sexAddress) {
      copyTradeService
        .getCopyTradersUserInfo({ address: sexAddress, chain: "solana" })
        .then((res) => {
          setCopyTradeUserInfo(res.data);
        });
    }
  }, [sexAddress]);

  if (pathname === "/create") {
    return null;
  }

  if (!tabsPath.includes(pathname)) return null;

  return (
    <div className={styles.Container}>
      {tabs.map((item: any) => {
        const isActive = item.key.includes(pathname);
        return (
          <div
            className={styles.Tab}
            key={item.path}
            onClick={() => {
              if (!window.sexAddress && item.needLogin) {
                window.connect();
                return;
              }

              router.push(item.path);
            }}
          >
            {item.label === "Smart" && canClaim > 0 && (
              <div className={styles.copyDot}></div>
            )}
            <item.icon
              size={item.iconSize}
              type={isActive ? "primary" : "disabled"}
            />
            <div
              style={{
                color: isActive ? "#FBCA04" : "#9290B1"
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
