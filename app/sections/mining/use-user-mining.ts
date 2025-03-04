import { httpAuthGet } from "@/app/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth";

export default function useUserMining() {
  const { accountRefresher } = useAuth();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onQuery = async () => {
    try {
      setLoading(true);
      const response = await httpAuthGet("/account/mining");
      setInfo(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountRefresher) onQuery();
  }, [accountRefresher]);

  return {
    info,
    loading,
    onQuery
  };
}
