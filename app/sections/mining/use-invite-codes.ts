import { httpAuthGet } from "@/app/utils";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth";
import { fail, success } from "@/app/utils/toast";

export default function useInviteCodes() {
  const { accountRefresher } = useAuth();
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const onQuery = async () => {
    try {
      setLoading(true);
      const response = await httpAuthGet("/airdrop/code");

      setList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const onCopyAll = useCallback(async () => {
    try {
      const text = list.map((item: any) => item.code).join(",");
      await navigator.clipboard.writeText(text);
      success("Copied successfully!");
    } catch (err) {
      fail("Copied failed!");
    }
  }, [list]);

  useEffect(() => {
    if (accountRefresher) onQuery();
  }, [accountRefresher]);

  return {
    list,
    loading,
    onCopyAll,
    onQuery
  };
}
