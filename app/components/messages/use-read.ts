import { useCallback } from "react";
import { httpAuthPost } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";

export default function useRead() {
  const onRead = useCallback(async ({ ids, onSuccess }: any) => {
    try {
      const response = await httpAuthPost(`/inform/list?ids=${ids.join(",")}`);
      if (response.code === 0) {
        onSuccess?.();
        if (!ids.length) success("Read all successfully");
      }
    } catch (err) {}
  }, []);

  return {
    onRead
  };
}
