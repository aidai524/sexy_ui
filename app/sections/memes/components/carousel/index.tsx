import { AnimatePresence, motion } from "framer-motion";
import styles from "./index.module.css";
import clsx from "clsx";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { formatLongText, numberFormatter } from "@/app/utils/common";
import SummaryItem from "@/app/sections/memes/components/summary-item";
import Emoji from "@/app/sections/memes/components/emoji";
import Big from "big.js";
import MemesTitle from "@/app/sections/memes/components/title";
import PriceChart from "@/app/sections/memes/components/chart";
import { getVideoExt } from "@/app/components/upload";
import VideoPlayer from "@/app/components/video";
import { useRouter } from 'next/navigation';
import { useUserAgent } from '@/app/context/user-agent';

interface CarouselProps {
  className?: string;
  data: any[];
  duration?: number;
}

const isVideoFile = (url: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const MediaItem = ({ item, onLoad }: { item: any; onLoad: () => void; }) => {
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

const Carousel: React.FC<CarouselProps> = ({
  className,
  data,
  duration = 10000
}) => {
  const router = useRouter();
  const { isMobile } = useUserAgent();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const preloadNextMedia = useCallback(() => {
    const nextIndex = (currentIndex + 1) % data.length;
    const nextItem = data[nextIndex];

    if (!nextItem) return;

    if (isVideoFile(nextItem.video)) {
      const video = document.createElement("video");
      video.preload = "auto";
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
    // if (!isMediaLoaded) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [handleNext, isMediaLoaded, duration]);

  const currentItem = data[currentIndex];

  const isProgress = useMemo(() => {
    if (!currentItem) return false;
    if ([0, 1].includes(currentItem.status)) return true;
    return false;
  }, [currentItem]);

  return (
    <div className={clsx(styles.CarouselContainer, className)}>
      <MemesTitle />
      <div className={styles.carouselWrapper}>
        {
          data.map((item, index) => (
            <motion.div
              key={index}
              className={styles.slide}
              initial={{ opacity: 0 }}
              animate={index === currentIndex ? { opacity: 1 } : { opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MediaItem item={item} onLoad={handleMediaLoad} />
              <div className={styles.slideContent}>
                <div
                  className={styles.CarouselAvatar}
                  onClick={() => {
                    router.push(`/detail?address=${item?.address}`);
                  }}
                >
                  {!item?.Icon ? (
                    isVideoFile(item?.video) ? (
                      <VideoPlayer
                        key={item.video}
                        id={item.id}
                        mediaId={`TokenItemLaptopAvatar-${item.id}`}
                        src={item.video}
                        type={getVideoExt(item.video)}
                        className={styles.CarouselAvatarImg}
                        autoPlay={false}
                        token={item as any}
                        style={{
                          borderRadius: 50,
                        }}
                      />
                    ) : (
                      <img
                        src={item?.video || "/img/token-placeholder.png"}
                        alt=""
                        className={styles.CarouselAvatarImg}
                      />
                    )
                  ) : (
                    <img
                      src={item?.Icon || "/img/token-placeholder.png"}
                      alt=""
                      className={styles.CarouselAvatarImg}
                    />
                  )}
                  <div className={styles.CarouselAvatarIcon}>👑</div>
                  <div
                    className={styles.CarouselAvatarBadge}
                    style={{
                      backgroundColor: [3].includes(item.status)
                        ? BadgeConfig.Listed.bg
                        : BadgeConfig.Ticking.bg
                    }}
                  >
                    {[3].includes(item.status)
                      ? BadgeConfig.Listed.label
                      : BadgeConfig.Ticking.label}
                    {item.DApp === "pump" && (
                      <div className={styles.CarouselAvatarPump}>
                        <img src="/img/memes/pump.svg" alt="" />
                      </div>
                    )}
                  </div>
                  {[3].includes(item.status) ? (
                    <Emoji content="✈️" />
                  ) : (
                    <Emoji content="🚀️" />
                  )}
                  <Emoji content="💰" placement="right" />
                </div>
                <div className={styles.CarouselTokenName}>
                  {formatLongText(item?.token_symbol, 6, 6)}
                </div>
                <div className={styles.CarouselSummaries}>
                  {[3].includes(item.status) ? (
                    <SummaryItem
                      type="plane"
                      value={(item.kind === "Hot" ? item.launched_like : item.like) || 0}
                    />
                  ) : (
                    <SummaryItem
                      type="rocket"
                      value={(item.kind === "Hot" ? item.launched_like : item.like) || 0}
                    />
                  )}
                  <SummaryItem type="user" value={item.holder} />
                </div>
                <div
                  className={clsx(
                    styles.CarouselMarketCap,
                    !isProgress ?
                      styles.CarouselMarketCapWithChart :
                      (isMobile ? styles.CarouselMarketCapWithProgress : styles.CarouselMarketCapWithProgressLaptop)
                  )}
                >
                  <div className={styles.CarouselMarketCapTop}>
                    <div className={styles.CarouselMarketCapValue}>
                      <div>
                        {numberFormatter(item?.market_cap, 1, true, {
                          prefix: "$",
                          isShort: true,
                          isShortUppercase: true
                        })}
                      </div>
                      <div className={styles.CarouselMarketCapChange}>
                        {
                          Big(item?.market_cap_24h_usd || 0).gte(0)
                            ? "+"
                            : "-"
                        }
                        {numberFormatter(
                          item?.market_cap_24h_usd,
                          2,
                          true,
                          {
                            isShort: true,
                            isShortUppercase: false
                          }
                        )}
                        <span className={styles.CarouselMarketCapChangeUnit}>(24h)</span>
                      </div>
                    </div>
                    {isProgress ? (
                      <div className={styles.CarouselProgressValue}>
                        {item?.progress}%
                      </div>
                    ) : (
                      <PriceChart
                        token={item}
                        className={styles.CarouselChart}
                      />
                    )}
                  </div>
                  {isProgress && (
                    <div className={styles.CarouselTokenProgress}>
                      <motion.div
                        className={styles.CarouselTokenProgressInner}
                        initial={{ x: "-100%" }}
                        animate={{
                          x: `-${Big(100)
                            .minus(item?.progress || 0)
                            .toFixed(2)}%`
                        }}
                        transition={{ duration: 0.6, ease: "linear" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        }
        {!!data && data.length > 1 && (
          <div className={styles.indicators}>
            {data.map((_, index) => (
              <div key={index} className={styles.indicatorWrapper}>
                <motion.span
                  className={clsx(
                    styles.indicator,
                    index === currentIndex &&
                      progress >= 100 &&
                      styles.activeIndicator
                  )}
                  onClick={() => handlePage(index)}
                />
                {index === currentIndex && (
                  <motion.span
                    className={styles.progressBar}
                    initial={{ x: "-100%" }}
                    animate={{ x: `-${100 - progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;

const BadgeConfig = {
  Ticking: {
    label: "Ticking",
    bg: "#628D0B"
  },
  Listed: {
    label: "Listed",
    bg: "#977900"
  }
};
