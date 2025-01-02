import SmokeButton from "./smoke-button";
import { useFlip } from "@/app/context/flip";

export default function SmokeButtonFlip({ size, token, id, onClick }: any) {
  const { onChangeFlip, isFlip } = useFlip();
  return (
    <SmokeButton
      size={size}
      id={id}
      token={token}
      onClick={() => {
        onChangeFlip(!isFlip, { onSuccess: onClick });
      }}
    />
  );
}
