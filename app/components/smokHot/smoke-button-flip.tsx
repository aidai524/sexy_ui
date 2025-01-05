import SmokeButton from "./smoke-button";
import { useFlip } from "@/app/context/flip";
import { useAuth } from "@/app/context/auth";

export default function SmokeButtonFlip({ size, token, id, onClick }: any) {
  const { onChangeFlip, isFlip } = useFlip();
  const { userInfo } = useAuth();
  return (
    <SmokeButton
      size={size}
      id={id}
      token={token}
      onClick={() => {
        if (!userInfo) {
          //@ts-ignore
          window.connect();
          return;
        }
        onChangeFlip(!isFlip, { onSuccess: onClick });
      }}
    />
  );
}
