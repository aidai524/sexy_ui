import { useCallback, useEffect, useRef, useState } from 'react';


interface VideoPlayerProps {
  src: string;
  type: string;
  className?: string;
}

export default function VideoPlayer({ src, type, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isShow, setIsShow] = useState(false);

  const handleClick = useCallback(() => {
    if (isShow) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isShow]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsShow(true)
            videoRef.current?.play();
          } else {
            setIsShow(false)
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoRef]);

  return (
    <video ref={videoRef} className={className} autoPlay>
      <source src={src} type={`video/${type}`} />
    </video>
  );
} 