import { useCallback, useEffect, useState } from "react";
import { httpAuthGet } from "@/app/utils";

export default function useNum() {
  const [num, setNum] = useState(0);

  const onQuery = useCallback(async () => {
    try {
      const response = await httpAuthGet("/inform/un_read_num");
      setNum(response.data);
    } catch (err) {
      setNum(0);
    }
  }, []);

  useEffect(() => {
    onQuery();
  }, []);

  return {
    num,
    onQuery
  };
}
