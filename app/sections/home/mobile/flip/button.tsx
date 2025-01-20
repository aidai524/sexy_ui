import { useUserAgent } from "@/app/context/user-agent";
import { useRef } from "react";

let entered = false;
let isDrag = false;
export default function Button(props: any) {
  const { isMobile } = useUserAgent();
  return isMobile ? <MobileButton {...props} /> : <LaptopButton {...props} />;
}

const LaptopButton = ({ children, className, onClick, x, run, setX }: any) => {
  const startXRef = useRef(0);
  return (
    <button
      className={`button ${className}`}
      style={{
        transform: `translateX(${x}px)`
      }}
      onMouseDown={(ev: any) => {
        ev.stopPropagation();
        startXRef.current = ev.clientX;
        entered = true;
        isDrag = false;
      }}
      onMouseMove={(ev) => {
        if (!entered) return;

        let diff = ev.clientX - startXRef.current;
        console.log("diff", diff);
        if (diff < 0) {
          diff = 0;
        }
        if (diff > 50) {
          diff = 170;
          run();
          entered = false;
          isDrag = true;
        }
        setX(diff);
      }}
      onMouseUp={() => {
        entered = false;
        if (isDrag) return;
        onClick();
      }}
    >
      {children}
    </button>
  );
};

const MobileButton = ({ children, className, onClick, x, run, setX }: any) => {
  const startXRef = useRef(0);
  return (
    <button
      className={`button ${className}`}
      onClick={onClick}
      style={{
        transform: `translateX(${x}px)`
      }}
      onTouchStart={(ev: any) => {
        ev.stopPropagation();
        startXRef.current = ev.touches[0].clientX;
      }}
      onTouchMove={(ev) => {
        let diff = ev.touches[0].clientX - startXRef.current;
        if (diff < 0) {
          diff = 0;
        }
        if (diff > 90) {
          diff = 170;
          run();
        }
        setX(diff);
      }}
    >
      {children}
    </button>
  );
};
