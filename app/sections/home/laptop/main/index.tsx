import Content from "./content";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function Main({ userInfo }: any) {
  const params = useSearchParams();

  const tab = useMemo(() => {
    if (!params) return 0;
    const launchType = params.get("launchType");
    let _t = 0;
    if (launchType === "1") {
      _t = 1;
    }
    return _t;
  }, [params]);
  return <Content key={tab} tab={tab} />;
}
