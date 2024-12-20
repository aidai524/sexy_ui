import Content from "./content";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function Main({ userInfo }: any) {
  const params = useSearchParams();
  const tab = useMemo(() => {
    if (!params) return 0;
    const launchType = params.get("launchType");
    if (launchType === "0") {
      return 0;
    } else if (launchType === "1") {
      return 1;
    } else {
      return 0;
    }
  }, [params]);
  return <Content key={tab} tab={tab} />;
}
