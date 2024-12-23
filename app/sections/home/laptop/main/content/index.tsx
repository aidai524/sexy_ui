import Token from "../token";
import Fullscreen from "../../fullscreen";
import useData from "../../../hooks/use-data";
import { useMemo, useState } from "react";

export default function Content({ tab }: any) {
  const [full, setFull] = useState(false);
  const type = useMemo(() => (tab ? "launching" : "preLaunch"), [tab]);
  const { infoData2, fullList, getnext } = useData(type);

  return (
    <>
      <Token
        {...{
          infoData2,
          onLike: () => {},
          onHate: () => {},
          getnext,
          type: tab,
          onOpenFull() {
            setFull(true);
          }
        }}
      />
      {full && (
        <Fullscreen
          {...{
            list: fullList,
            onLike: () => {},
            onHate: () => {},
            getnext,
            onExit() {
              setFull(false);
            }
          }}
        />
      )}
    </>
  );
}
