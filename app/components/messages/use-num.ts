import { useCallback, useEffect, useState } from "react";
import { httpAuthGet } from "@/app/utils";
import { useAuth } from "@/app/context/auth";

export default function useNum() {
  const [num, setNum] = useState(0);
  const { accountRefresher } = useAuth();

  const onQuery = useCallback(async () => {
    try {
      const response = await httpAuthGet("/inform/un_read_num");
      setNum(response.data);
    } catch (err) {
      setNum(0);
    }
  }, []);

  useEffect(() => {
    if (accountRefresher) {
      onQuery();
    } else {
      setNum(0);
    }
  }, [accountRefresher]);

  return {
    num,
    onQuery
  };
}
