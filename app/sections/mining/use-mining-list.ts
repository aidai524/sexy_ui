import { httpAuthGet } from "@/app/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth";

export default function useMiningList() {
  const { accountRefresher } = useAuth();
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const onQuery = async () => {
    try {
      setLoading(true);
      const response = await httpAuthGet("/mining/user/list", {
        limit: 100,
        offset: 0
      });
      setList(response.data.list);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountRefresher) onQuery();
  }, [accountRefresher]);

  return {
    list,
    loading
  };
}
