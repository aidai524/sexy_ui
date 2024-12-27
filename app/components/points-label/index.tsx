import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Icon from "./Reicon";
import { httpAuthGet } from "@/app/utils";
import { numberFormatter } from "@/app/utils/common";

export default function PointsLabel({ id, reverse = false, bg }: any) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const response = await httpAuthGet("/account/mining/user");
        setAmount(response.data.minted_amount);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div
      className={styles.Container}
      id={id}
      style={{
        flexDirection: reverse ? "row-reverse" : "row",
        backgroundColor: bg || "#0000004d",
        textAlign: reverse ? "right" : "left"
      }}
    >
      <Icon size={30} />
      <div>
        <div className={styles.Title}>
          {numberFormatter(amount, 2, true, {
            isShort: true
          })}
        </div>
        <div className={styles.Desc}>$FlipN</div>
      </div>
    </div>
  );
}
