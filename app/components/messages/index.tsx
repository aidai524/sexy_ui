import Badge from "@/app/components/badge";
import AlarmIcon from "@/app/components/icons/alarm";
import { useRouter } from "next/navigation";
import { useMessages } from "@/app/context/messages";
import { useUserAgent } from "@/app/context/user-agent";

export default function MessagesAlarm() {
  const { num } = useMessages();
  const router = useRouter();
  const { isMobile } = useUserAgent();

  return (
    <>
      <Badge isSimple={true} number={num}>
        <div
          style={{
            position: "relative"
          }}
        >
          <div
            className="button"
            onClick={() => {
              if (!window.sexAddress) {
                window.connect();
                return;
              }
              router.push("/messages");
            }}
          >
            <AlarmIcon />
          </div>
        </div>
      </Badge>
    </>
  );
}
