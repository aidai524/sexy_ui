import type { Project } from "@/app/type";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounceFn } from "ahooks";
import { useVideoPlayer } from "@/app/store/use-video-player";
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
  mediaId: string;
}

export default function VideoPlayer({
  src,
  type,
  id,
  mediaId,
  className,
  style = {},
  videoProgressStyle
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoPlayerStore: any = useVideoPlayer();
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
        setMergedSrc(src + '#t=0.1');
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
        videoPlayerStore.setPlay(!videoPlayerStore.isPlay, mediaId);
        videoPlayerStore.setAutoPlay(!videoPlayerStore.isPlay);
      }}
    >
      <video
        loop={videoPlayerStore.isPlay}
        onTimeUpdate={onTimeUpdate}
        ref={videoRef}
        playsInline
        webkit-playsinline
        style={{
          ...style,
          objectFit: "contain",
          width: "100%"
        }}
        preload={videoPlayerStore.autoPlay ? "auto" : "none"}
        id={mediaId}
      >
        <source src={mergedSrc} type={`video/${type}`} />
      </video>
      {!videoPlayerStore.isPlay && (
        <div
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
