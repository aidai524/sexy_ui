import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRCodeCom({ url, size = 50 }: any) {
  const domRef = useRef<any>();

  useEffect(() => {
    QRCode.toCanvas(url, { width: size }, (err, canvas) => {
      if (err) {
        console.error(err);
        return;
      }
      domRef.current.appendChild(canvas);
    });
  }, []);
  return <div ref={domRef}></div>;
}
