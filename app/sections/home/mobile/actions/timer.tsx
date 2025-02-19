import { useEffect, useState } from "react";
import styles from "./timer.module.css";
import useTimeLeft from "@/app/hooks/useTimeLeft";

export default function Timer({ time, isPreview }: any) {
  const [startTime, setStartTime] = useState(0);
  const { timeFormat } = useTimeLeft({
    time: startTime
  });

  useEffect(() => {
    setStartTime(time + 1000 * 60 * 60 * 3);

    return () => {
      setStartTime(0);
    };
  }, []);

  if (isPreview) return <div className={styles.Container}>03:00:00</div>;

  if (!startTime || !timeFormat) return null;

  return <div className={styles.Container}>{timeFormat}</div>;
}
