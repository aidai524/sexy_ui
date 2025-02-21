import { useEffect, useState, useRef } from "react";
import { httpGet } from "@/app/utils";

export default function useTips() {
  const [prevTip, setPrevTip] = useState<any>();
  const [tip, setTip] = useState<any>();
  const cached = useRef<any>();
  const prevRef = useRef<any>();
  const currentRef = useRef<any>();

  useEffect(() => {
    let timer: any = null;

    const fetchTip = async () => {
      try {
        const response = await httpGet("/bought/data");
        setTip(response.data);
        setPrevTip(cached.current);
        setTip(response.data);
        cached.current = response.data;
        clearTimeout(timer);
        timer = setTimeout(() => {
          fetchTip();
        }, 2000);
      } catch (err) {
        setPrevTip(null);
        setTip(null);
      } finally {
      }
    };

    fetchTip();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    prevRef.current.style.opacity = 1;
    prevRef.current.style.transition = "none";
    prevRef.current.style.transform = "translateY(0px)";
    currentRef.current.style.opacity = 0;
    currentRef.current.style.transition = "none";
    currentRef.current.style.transform = "translateY(24px)";

    setTimeout(() => {
      prevRef.current.style.opacity = 0;
      prevRef.current.style.transition = "0.3s";
      prevRef.current.style.transform = "translateY(-24px)";
      currentRef.current.style.opacity = 1;
      currentRef.current.style.transition = "0.3s";
      currentRef.current.style.transform = "translateY(0px)";
    }, 1000);
  }, [tip]);

  return { tip, prevTip, prevRef, currentRef };
}
