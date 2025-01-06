import { useAuth } from "@/app/context/auth";
import { useCallback, useEffect, useState } from "react";
import { httpAuthGet } from "@/app/utils";

export default function useCheckFliped(tokens: any[], isOther: boolean) {
  const [unfliped, setUnfliped] = useState<any>([]);
  const { accountRefresher } = useAuth();

  const queryFilped = useCallback(async () => {
    const addresses = tokens.map((token: any) => token.address);
    try {
      const response = await httpAuthGet(
        `/account/check_prepaid?tokens=${addresses.join(",")}`
      );
      setUnfliped(response.data || []);
    } catch (err) {
      setUnfliped([]);
    }
  }, [accountRefresher, tokens]);

  useEffect(() => {
    if (!isOther) return;
    if (!tokens?.length || !accountRefresher) return;
    queryFilped();
  }, [tokens, isOther, accountRefresher]);

  return {
    unfliped
  };
}
