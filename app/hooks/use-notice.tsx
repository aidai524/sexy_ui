import { useEffect, useRef } from "react";
import { useAuth } from "@/app/context/auth";
import { httpAuthGet } from "@/app/utils";
import { Toast } from "antd-mobile";
import useRead from "../components/messages/use-read";
import { useUserAgent } from "@/app/context/user-agent";
export default function useNotice() {
  const { accountRefresher } = useAuth();
  const noticesRef = useRef<any>([]);
  const timerRef = useRef<any>();
  const { onRead } = useRead();
  const { isWindowVisible } = useUserAgent();

  const onToast = (list: any) => {
    const notice = list.shift();
    Toast.show({
      content: (
        <div style={{ color: "#AAFF00", wordBreak: "break-word" }}>
          {notice.content_2} you liked has been launched!
        </div>
      ),
      position: "top",
      duration: 5000,
      afterClose() {
        onRead({ ids: [notice.id] });
        noticesRef.current = list;
        if (list.length) {
          onToast(list);
        } else {
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            onQuery();
          }, 10000);
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
      if (list.length) {
        onToast(list);
      } else {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onQuery();
        }, 10000);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (!isWindowVisible) {
      clearTimeout(timerRef.current);
      return;
    }
    if (accountRefresher) onQuery();
  }, [accountRefresher, isWindowVisible]);
}
