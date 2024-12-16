import Token from "../token";
import useData from "../../../hooks/use-data";
import { useMemo } from "react";

export default function Content({ tab }: any) {
  const type = useMemo(() => (tab ? "launching" : "preLaunch"), [tab]);
  const { infoData2, onLike, onHate, getnext } = useData(type);
  return <Token {...{ infoData2, onLike, onHate, getnext }} />;
}
