import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRCodeCom({ url }: any) {
  const domRef = useRef<any>();

  useEffect(() => {
    QRCode.toCanvas(
      "https://stage.flipn.fun/detail?address=DSbNaSefobZcfntFLYYfFreHDzjovhDbyJ2qp1WpT7J5",
      { width: 200 },
      (err, canvas) => {
        if (err) {
          console.error(err);
          return;
        }
        domRef.current.appendChild(canvas);
      }
    );
  }, []);
  return <div ref={domRef}></div>;
}
