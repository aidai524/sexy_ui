import Danmaku from "danmaku/dist/esm/danmaku.canvas.js";
import { useEffect, useRef } from "react";

export default function DanmakuComp() {
  const eleRef = useRef<HTMLDivElement>(null);
  const danmakuRef = useRef<any>();

  useEffect(() => {
    danmakuRef.current = new Danmaku({
      container: eleRef.current,
      comments: []
    });
  }, []);
  return <div ref={eleRef}></div>;
}
