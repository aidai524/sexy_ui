import { AnimatePresence, motion } from 'framer-motion';
import styles from './index.module.css';
import clsx from 'clsx';
import { useEffect, useState, useCallback, useRef } from 'react';
import { formatLongText, numberFormatter } from '@/app/utils/common';
import SummaryItem from '@/app/sections/memes/components/summary-item';

interface CarouselProps {
  className?: string;
  data: any[];
  duration?: number;
}

const isVideoFile = (url: string) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

const MediaItem = ({ item, onLoad }: { item: any; onLoad: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad();
  };

  useEffect(() => {
    setIsLoading(true);

    if (videoRef.current?.readyState === 4 || imgRef.current?.complete) {
      handleLoad();
    }
  }, [item.video]);

  if (isVideoFile(item.video)) {
    return (
      <>
        {isLoading && <div className={styles.placeholder} />}
        <video
          ref={videoRef}
          src={item.video}
          className={clsx(styles.slideImage, isLoading && styles.hidden)}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={handleLoad}
          onError={() => setIsLoading(false)}
        />
      </>
    );
  }

  return (
    <>
      {isLoading && <div className={styles.placeholder} />}
      <img
        ref={imgRef}
        src={item.video}
        alt={item.token_name}
        className={clsx(styles.slideImage, isLoading && styles.hidden)}
        onLoad={handleLoad}
        onError={() => setIsLoading(false)}
        loading="eager"
      />
    </>
  );
};

const Carousel: React.FC<CarouselProps> = ({ className, data, duration = 10000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const preloadNextMedia = useCallback(() => {
    const nextIndex = (currentIndex + 1) % data.length;
    const nextItem = data[nextIndex];

    if (isVideoFile(nextItem.video)) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = nextItem.video;
    } else {
      const img = new Image();
      img.src = nextItem.video;
    }
  }, [currentIndex, data]);

  const handleMediaLoad = useCallback(() => {
    setIsMediaLoaded(true);
    preloadNextMedia();
  }, [preloadNextMedia]);

  const handleNext = useCallback(() => {
    setIsMediaLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % data.length);
    setProgress(0);
  }, [data.length]);

  const handlePrevious = useCallback(() => {
    setIsMediaLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    setProgress(0);
  }, [data.length]);

  const handlePage = (index: number) => {
    if (index === currentIndex) return;
    setIsMediaLoaded(false);
    setCurrentIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    if (!isMediaLoaded) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [handleNext, isMediaLoaded, duration]);

  const currentItem = data[currentIndex];

  return (
    <div className={clsx(styles.CarouselContainer, className)}>
      <div className={styles.carouselWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={styles.slide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <MediaItem item={currentItem} onLoad={handleMediaLoad} />
            <div className={styles.slideContent}>
              <div className={styles.CarouselAvatar}>
                <img src={currentItem.icon} alt="" className={styles.CarouselAvatarImg} />
                <div className={styles.CarouselAvatarIcon}>
                  👑
                </div>
                <div className={styles.CarouselAvatarBadge}>
                  Ticking
                  <div className={styles.CarouselAvatarPump}>
                    <img src="/img/memes/pump.svg" alt="" />
                  </div>
                </div>
              </div>
              <div className={styles.CarouselTokenName}>
                {formatLongText(currentItem.token_name, 6, 12)}
              </div>
              <div className={styles.CarouselSummaries}>
                <SummaryItem type="rocket" value={2} />
                <SummaryItem type="user" value={1234} />
                <SummaryItem type="plane" value={1234} />
              </div>
              <div className={styles.CarouselMarketCap}>
                <div className={styles.CarouselMarketCapTop}>
                  <div className={styles.CarouselMarketCapValue}>
                    <div>
                      {numberFormatter('23456', 1, true, { prefix: '$', isShort: true, isShortUppercase: true })}
                    </div>
                    <div className={styles.CarouselMarketCapChange}>
                      {numberFormatter('10000', 1, true, { prefix: '+', isShort: true, isShortUppercase: false })}
                    </div>
                  </div>
                  <div className={styles.CarouselProgressValue}>
                    65%
                  </div>
                </div>
                <div className={styles.CarouselTokenProgress}>
                  <motion.div
                    className={styles.CarouselTokenProgressInner}
                    initial={{ x: '-100%' }}
                    animate={{ x: `-${100 - 65}%` }}
                    transition={{ duration: 0.6, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={styles.indicators}>
          {data.map((_, index) => (
            <div key={index} className={styles.indicatorWrapper}>
              <motion.span
                className={clsx(
                  styles.indicator,
                  index === currentIndex && progress >= 100 && styles.activeIndicator
                )}
                onClick={() => handlePage(index)}
              />
              {index === currentIndex && (
                <motion.span
                  className={styles.progressBar}
                  initial={{ x: '-100%' }}
                  animate={{ x: `-${100 - progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;

const BadgeConfig = {
  Ticking: {
    bg: '#628D0B',
  },
  Listed: {
    bg: '#977900',
  },
};
