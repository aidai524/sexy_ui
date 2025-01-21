import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QRCodeCom({ url, size = 50, onSuccess, scale = 2 }: any) {
  const domRef = useRef<any>();

  useEffect(() => {
    if (url) {
      QRCode.toCanvas(url, { width: size * scale, margin: 2 }, (err, canvas) => {
        if (err) {
          console.error(err);
          return;
        }
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";
        domRef.current.innerHTML = '';
        domRef.current.appendChild(canvas);
        onSuccess && onSuccess(canvas);
      });
    }
    
  }, [url]);
  return <div ref={domRef} style={{ width: size, height: size, borderRadius: 4, overflow: 'hidden' }}></div>;
}

export function QRCodeImage({ url, size = 50, onSuccess, scale = 2 }: any) {
  const domRef = useRef<any>();

  useEffect(() => {
    if (url) {
      QRCode.toDataURL(url, { width: size * scale, margin: 2 }, (err, str) => {
        if (err) {
          console.error(err);
          return;
        }
        const img = document.createElement("img");
        img.src = str;
        img.alt = "";
        img.width = size;
        img.height = size;
        domRef.current.innerHTML = '';
        domRef.current.appendChild(img);
        onSuccess && onSuccess(str);
      });
    }

  }, [url]);
  return <div ref={domRef} style={{ width: size, height: size, borderRadius: 4, overflow: 'hidden' }}></div>;
}
