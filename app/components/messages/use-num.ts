import { useCallback, useEffect, useState, useRef } from "react";
import { httpAuthGet } from "@/app/utils";
import { useAuth } from "@/app/context/auth";
import { useDebounceFn } from "ahooks";

export default function useNum() {
  const [num, setNum] = useState(0);
  const { accountRefresher } = useAuth();
  const timerRef = useRef<any>();

  const onQuery = useCallback(async () => {
    try {
      const response = await httpAuthGet("/inform/un_read_num");
      setNum(response.data);

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onQuery();
      }, 10000);
    } catch (err) {
      setNum(0);
    }
  }, []);

  const { run } = useDebounceFn(
    () => {
      if (accountRefresher) {
        onQuery();
      } else {
        setNum(0);
      }
    },
    { wait: 1000 }
  );

  useEffect(() => {
    run();
  }, [accountRefresher]);

  return {
    num,
    onQuery
  };
}
