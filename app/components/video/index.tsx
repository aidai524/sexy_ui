import { useSetting } from "@/app/store/use-setting";
import type { Project } from "@/app/type";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounceFn } from "ahooks";
import ProgressBar from "./progress-bar";
import mediaStore from "@/app/libs/media-store";

interface VideoPlayerProps {
  src: string;
  type: string;
  id: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  token?: Project;
  playManually?: boolean;
  videoProgressStyle?: any;
}

export default function VideoPlayer({
  src,
  type,
  id,
  className,
  style = {},
  autoPlay = true,
  token,
  playManually = false,
  videoProgressStyle
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isShow, setIsShow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPlay, setIsPlay] = useState(false);
  const { autoPlay: autoPlaySetting, set }: any = useSetting();
  const [progress, setProgress] = useState(0);
  const [mergedSrc, setMergedSrc] = useState("");

  const { run: onTimeUpdate } = useDebounceFn(
    () => {
      if (videoRef.current?.currentTime && videoRef.current?.duration) {
        setProgress(videoRef.current.currentTime / videoRef.current.duration);
      }
    },
    { wait: 100 }
  );

  const handleClick = useCallback(() => {
    if (!autoPlay || !autoPlaySetting || !playManually) {
      return;
    }

    if (isShow && isVisible) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isShow, isVisible, autoPlay, autoPlaySetting, playManually]);

  // useEffect(() => {
  //   document.addEventListener('click', handleClick);
  //   return () => {
  //     document.removeEventListener('click', handleClick);
  //   };
  // }, [handleClick]);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            // const rect = videoRef.current?.getBoundingClientRect();
            // if (rect) {
            //   const isInViewport =
            //     rect.top >= 0 &&
            //     rect.left >= 0 &&
            //     rect.bottom <=
            //       (window.innerHeight ||
            //         document.documentElement.clientHeight) &&
            //     rect.right <=
            //       (window.innerWidth || document.documentElement.clientWidth);
            //   setIsShow(isInViewport);
            //   if (autoPlay && autoPlaySetting && !playManually) {
            //     // const outDom = document.getElementById(
            //     //   `${token?.status === 0 ? "preLaunch" : "launching"}-list`
            //     // );

            //     // if (outDom?.style.opacity === "1") {
            //     //   videoRef.current?.play();
            //     // }
            //     videoRef.current?.play();
            //   }
            //   videoRef.current?.play();
            // } else {
            //   setIsShow(false);
            //   videoRef.current?.pause();
            // }
            autoPlaySetting && videoRef.current?.play();
          } else {
            setIsShow(false);
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement) {
          const opacity = mutation.target.style.opacity;
          if (opacity === "0") {
            videoRef.current?.pause();
            setIsVisible(false);
          } else {
            setIsVisible(true);
            if (autoPlay && autoPlaySetting) {
              // videoRef.current?.play();
            }
          }
        }
      });
    });

    if (videoRef.current) {
      // const outDom = document.getElementById(
      //   `${token?.status === 0 ? "preLaunch" : "launching"}-list`
      // );
      // if (outDom) {
      //   mutationObserver.observe(outDom, {
      //     attributes: true,
      //     attributeFilter: ["style"]
      //   });
      // }

      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);

        mutationObserver.disconnect();
      }
    };
  }, [videoRef.current, autoPlay, autoPlaySetting, token]);


  const allStyle = useMemo(() => {
    return {
      ...style,
      position: "relative"
    };
  }, [style]);

  useEffect(() => {
    if (!id && !src) return;
    const getSrc = async () => {
      try {
        const blob: any = await mediaStore.getFile(id);
        setMergedSrc(URL.createObjectURL(blob));
      } catch (err) {
        setMergedSrc(src);
      }
    };
    getSrc();
  }, [id, src]);

  if (!mergedSrc) return null;

  return (
    <div
      className={className}
      style={allStyle as React.CSSProperties}
      onClick={() => {
        if (!autoPlay) {
          return;
        }

        if (isPlay) {
          videoRef.current?.pause();
          set({ autoPlay: false });
        } else {
          videoRef.current?.play();
          set({ autoPlay: true });
        }
      }}
    >
      <video
        loop={autoPlay && autoPlaySetting}
        onPause={() => {
          setIsPlay(false);
        }}
        onPlay={() => {
          setIsPlay(true);
        }}
        onEnded={() => {
          setIsPlay(false);
        }}
        onTimeUpdate={onTimeUpdate}
        ref={videoRef}
        playsInline
        webkit-playsinline
        className={className}
        style={style}
        preload="auto"
      >
        <source src={mergedSrc} type={`video/${type}`} />
      </video>
      {autoPlay && !isPlay && (
        <div
          onClick={() => {}}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "68px",
            height: "68px",
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
          >
            <circle cx="40" cy="40" r="40" fill="black" fillOpacity="0.3" />
            <path
              d="M51 33.0718C56.3333 36.151 59 37.6906 59 40C59 42.3094 56.3333 43.849 51 46.9282L40.5 52.9904C35.1667 56.0696 32.5 57.6092 30.5 56.4545C28.5 55.2998 28.5 52.2206 28.5 46.0622L28.5 33.9378C28.5 27.7794 28.5 24.7002 30.5 23.5455C32.5 22.3908 35.1667 23.9304 40.5 27.0096L51 33.0718Z"
              fill="white"
            />
          </svg>
        </div>
      )}
      {videoProgressStyle && (
        <ProgressBar
          progress={progress}
          videoProgressStyle={videoProgressStyle}
        />
      )}
    </div>
  );
}

//preload={autoPlay ? "auto" : "none"}
