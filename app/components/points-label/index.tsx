import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import Icon from "./Reicon";
import { httpAuthGet } from "@/app/utils";
import { numberFormatter } from "@/app/utils/common";
import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";
import { useUserAgent } from "@/app/context/user-agent";
export default function PointsLabel({ id, reverse = false, bg }: any) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { accountRefresher, userInfo } = useAuth();
  const timer = useRef<any>();
  const { isWindowVisible } = useUserAgent();

  const init = async () => {
    timer.current && clearTimeout(timer.current);
    try {
      setLoading(true);
      const response = await httpAuthGet("/account/mining/user");
      setAmount(response.data.minted_amount);
      timer.current = setTimeout(() => {
        init();
      }, 60000);
    } catch (err) {
      setAmount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isWindowVisible) {
      clearTimeout(timer.current);
      return;
    }
    if (accountRefresher) {
      init();
    } else {
      setAmount(0);
    }
  }, [accountRefresher, isWindowVisible]);

  return (
    <div
      className={`${styles.Container} button`}
      id={id}
      style={{
        flexDirection: reverse ? "row-reverse" : "row",
        backgroundColor: bg || "#0000004d",
        textAlign: reverse ? "right" : "left"
      }}
      onClick={() => {
        if (!userInfo?.address) {
          //@ts-ignore
          window?.connect();
        }

        router.push("/reward");
      }}
    >
      <Icon size={30} />
      <div>
        <div className={styles.Title}>
          {numberFormatter(amount, 3, true, {
            isShort: true,
            round: 0
          })}
        </div>
        <div className={styles.Desc}>$Fun</div>
      </div>
    </div>
  );
}
