import { useEffect, useState } from "react";
import styles from "./timer.module.css";
import useTimeLeft from "@/app/hooks/useTimeLeft";

export default function Timer({ time }: any) {
  const [startTime, setStartTime] = useState(0);
  const { timeFormat } = useTimeLeft({
    time: startTime
  });

  useEffect(() => {
    setStartTime(time + 1000 * 60 * 60 * 24 * 3);

    return () => {
      setStartTime(0);
    };
  }, []);

  if (!startTime || !timeFormat) return null;

  return <div className={styles.Container}>{timeFormat}</div>;
}
