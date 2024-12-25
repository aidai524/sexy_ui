import { useCallback } from "react";

interface ScrollOptions {
  checkInterval?: number;
  maxAttempts?: number;
}

export const useScrollIntoView = (options: ScrollOptions = {}) => {
  const { checkInterval = 50, maxAttempts = 20 } = options;

  const isElementInViewport = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const viewWidth = window.innerWidth;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewHeight &&
      rect.right <= viewWidth
    );
  }, []);

  const scrollElementIntoView = useCallback(
    (element: HTMLElement, onScrollEnd?: (element: HTMLElement) => void) => {
      if (isElementInViewport(element)) {
        onScrollEnd?.(element);
        return Promise.resolve(true);
      }

      return new Promise((resolve) => {
        const rect = element.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const viewWidth = window.innerWidth;
        const scrollX =
          window.scrollX + rect.left - (viewWidth / 2 - rect.width / 2);
        const scrollY =
          window.scrollY + rect.top - (viewHeight / 2 - rect.height / 2);

        let scrollTimeout: NodeJS.Timeout;
        let scrollCount = 0;

        const checkScrollEnd = () => {
          scrollCount++;
          if (scrollCount >= maxAttempts) {
            cleanup();
            onScrollEnd?.(element);
            resolve(true);
            return;
          }

          if (isElementInViewport(element)) {
            cleanup();
            onScrollEnd?.(element);
            resolve(true);
          } else {
            scrollTimeout = setTimeout(checkScrollEnd, checkInterval);
          }
        };

        const cleanup = () => {
          clearTimeout(scrollTimeout);
          window.removeEventListener("scroll", onScroll);
        };

        const onScroll = () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(checkScrollEnd, checkInterval);
        };

        window.addEventListener("scroll", onScroll);

        window.scrollTo({
          top: scrollY,
          left: scrollX,
          behavior: "smooth"
        });

        scrollTimeout = setTimeout(checkScrollEnd, checkInterval);
      });
    },
    [maxAttempts, checkInterval, isElementInViewport]
  );

  return {
    scrollElementIntoView,
    isElementInViewport
  };
};
