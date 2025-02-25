import Info from "@/app/sections/detail/components/desc";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";

export default function Details({ token }: any) {
  const mc = useMcWithPump(token);
  return <Info mc={mc} data={token} from="panel" />;
}
