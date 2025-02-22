import { useEffect, useState, useRef } from "react";
import { httpGet } from "@/app/utils";
import useIsWindowVisible from "@/app/hooks/use-is-window-visible";

export default function useTips() {
  const [prevTip, setPrevTip] = useState<any>();
  const [tip, setTip] = useState<any>();
  const cached = useRef<any>();
  const prevRef = useRef<any>({});
  const currentRef = useRef<any>({});
  const timer = useRef<any>();
  const isWindowVisible = useIsWindowVisible();

  const fetchTip = async () => {
    try {
      const response = await httpGet("/bought/data");
      const temp = response.data;
      if (temp.project_status === 0) {
        temp.trade_type = "flip";
      }
      setTip(temp);
      setPrevTip(cached.current);
      cached.current = temp;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fetchTip();
      }, 2000);
    } catch (err) {
      setPrevTip(null);
      setTip(null);
    } finally {
    }
  };

  useEffect(() => {
    fetchTip();

    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (prevRef.current) {
      prevRef.current.style.opacity = 1;
      prevRef.current.style.transition = "none";
      prevRef.current.style.transform = "translateY(0px)";
    }

    if (currentRef.current) {
      currentRef.current.style.opacity = 0;
      currentRef.current.style.transition = "none";
      currentRef.current.style.transform = "translateY(24px)";
    }

    setTimeout(() => {
      if (prevRef.current) {
        prevRef.current.style.opacity = 0;
        prevRef.current.style.transition = "0.3s";
        prevRef.current.style.transform = "translateY(-24px)";
      }

      if (currentRef.current) {
        currentRef.current.style.opacity = 1;
        currentRef.current.style.transition = "0.3s";
        currentRef.current.style.transform = "translateY(0px)";
      }
    }, 1000);
  }, [tip]);

  useEffect(() => {
    if (isWindowVisible) {
      fetchTip();
    } else {
      clearTimeout(timer.current);
    }
  }, [isWindowVisible]);

  return { tip, prevTip, prevRef, currentRef };
}
