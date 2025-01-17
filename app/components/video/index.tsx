import { useCallback, useEffect, useRef } from 'react';


interface VideoPlayerProps {
  src: string;
  type: string;
  className?: string;
}

export default function VideoPlayer({ src, type, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = useCallback(() => {
    videoRef.current?.play();
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return (
    <video ref={videoRef} className={className} autoPlay>
      <source src={src} type={`video/${type}`} />
    </video>
  );
} 