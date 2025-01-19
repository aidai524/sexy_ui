import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRCodeCom({ url, size = 50 }: any) {
  const domRef = useRef<any>();

  useEffect(() => {
    if (url) {
      QRCode.toCanvas(url, { width: size }, (err, canvas) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(canvas);
        domRef.current.appendChild(canvas);
      });
    }
    
  }, [url]);
  return <div ref={domRef}></div>;
}
