import { useEffect, useRef } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { httpAuthGet } from "@/app/utils";
import { Toast } from "antd-mobile";

export default function useNotice() {
  const { address: userAddress } = useAccount();
  const noticesRef = useRef<any>([]);
  const timerRef = useRef<any>();

  const onToast = (list: any) => {
    const notice = list.shift();
    Toast.show({
      content: (
        <div style={{ color: "#AAFF00" }}>
          {notice.content_2} you liked has been launched!
        </div>
      ),
      position: "top",
      duration: 5000,
      afterClose() {
        noticesRef.current = list;
        if (list.length) {
          onToast(list);
        }
      }
    });
  };

  const onQuery = async () => {
    try {
      const response = await httpAuthGet(
        `/inform/list?limit=10&offset=0&type=token_launching_owner`
      );

      let list = [...noticesRef.current];
      if (response.data?.list) {
        list = [...list, ...response.data.list];
      }
      // TODO
      // onToast(list);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onQuery();
      }, 10000);
    } catch (err) {}
  };

  useEffect(() => {
    if (userAddress && process.env.NODE_ENV !== "development") onQuery();
  }, [userAddress]);
}
