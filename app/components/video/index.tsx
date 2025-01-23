import { useSetting } from '@/app/store/use-setting';
import type { Project } from '@/app/type';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';


interface VideoPlayerProps {
  src: string;
  type: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  token?: Project;
  playManually?: boolean;
}

export default function VideoPlayer({ src, type, className, style = {}, autoPlay = true, token, playManually = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isShow, setIsShow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPlay, setIsPlay] = useState(false);
  const { autoPlay: autoPlaySetting, set }: any = useSetting();

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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = videoRef.current?.getBoundingClientRect();
            if (rect) {
              const isInViewport =
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth);
              setIsShow(isInViewport)
              if (autoPlay && autoPlaySetting && !playManually) {
                videoRef.current?.play();
              }
            } else {
              setIsShow(false)
              videoRef.current?.pause();
            }
          } else {
            setIsShow(false)
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
          if (opacity === '0') {
            videoRef.current?.pause();
            setIsVisible(false);
          } else {
            setIsVisible(true)
            if (autoPlay && autoPlaySetting) {
              // videoRef.current?.play();
            }
          }
        }
      });
    });

    if (videoRef.current) {
      const outDom = document.getElementById(`${token?.status === 0 ? 'preLaunch' : 'launching'}-list`);
      if (outDom) {
        mutationObserver.observe(outDom, {
          attributes: true,
          attributeFilter: ['style']
        });
      }
      if (videoRef.current) {
        observer.observe(videoRef.current);
      }
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
        
        mutationObserver.disconnect();
      }
    };
  }, [videoRef, autoPlay, autoPlaySetting, token]);



  const allStyle = useMemo(() => {
    return {
      ...style,
      position: 'relative',
    }
  }, [style]);


  return (
    <div className={className} style={allStyle as React.CSSProperties} onClick={() => {
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
    }}>

      <video loop={autoPlay && autoPlaySetting} onPause={() => {
        setIsPlay(false);
      }} onPlay={() => {
        setIsPlay(true);
      }} onEnded={() => {
        setIsPlay(false);
      }} ref={videoRef} playsInline webkit-playsinline className={className} style={style}>
        <source src={src} type={`video/${type}`} />
      </video>
      {
        (autoPlay && !isPlay) && (
          <div onClick={() => {
            
          }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '68px', height: '68px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 9.26795C19.3333 10.0377 19.3333 11.9623 18 12.7321L3 21.3923C1.66667 22.1621 -1.05781e-06 21.1999 -9.90511e-07 19.6603L-2.33408e-07 2.33975C-1.6611e-07 0.800144 1.66667 -0.162106 3 0.607695L18 9.26795Z" fill="white" />
            </svg>
          </div>
        )
      }
    </div>

  );
}

//preload={autoPlay ? "auto" : "none"} 


