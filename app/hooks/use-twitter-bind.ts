import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { httpAuthPost } from "../utils";
import { success, fail } from "@/app/utils/toast";

export default function useTwitterBind({
  onSuccess
}: {
  onSuccess: VoidFunction;
}) {
  const [loading, setLoading] = useState(false);
  const { accountRefresher } = useAuth();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const handleBind = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await httpAuthPost("/bind/twitter", {
        state: "state",
        code
      });
      if (result.code !== 0) throw new Error(result.msg);
      success("Bind successfully!");
      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      fail("Bind failed!");
    }
  }, [code, loading]);

  useEffect(() => {
    if (!accountRefresher || !code) return;
    handleBind();
  }, [code, accountRefresher]);

  return { loading, handleBind };
}
