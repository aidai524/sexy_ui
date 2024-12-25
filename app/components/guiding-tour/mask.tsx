import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MaskPlacement,
  getPositionStyle,
  getMaskBoundRect
} from "./get-style-rect";
import { useScrollIntoView } from "@/app/hooks/use-scroll-into-view";
import styles from "./index.module.css";

interface MaskProps {
  element: HTMLElement;
  container?: HTMLElement;
  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  placement?: MaskPlacement;
  contentWidth?: number;
  contentHeight?: number;
  reset?: boolean;
  type?: string;
}

export const Mask: React.FC<MaskProps> = (props) => {
  const {
    element,
    renderMaskContent,
    container,
    onAnimationStart,
    onAnimationEnd,
    placement = 0,
    contentWidth = 200,
    contentHeight = 100,
    reset = false,
    type
  } = props;

  const [style, setStyle] = useState<CSSProperties>({});

  const { scrollElementIntoView } = useScrollIntoView({
    checkInterval: 50,
    maxAttempts: 20
  });

  useEffect(() => {
    onAnimationStart?.();
    const timer = setTimeout(() => {
      onAnimationEnd?.();
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [element]);

  useEffect(() => {
    if (reset) {
      setStyle({});
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      return;
    }

    if (!element) {
      return;
    }

    let mounted = true;

    const updatePosition = async () => {
      await scrollElementIntoView(element, (element) => {
        if (mounted) {
          const style = getMaskBoundRect(
            element,
            container || document.documentElement
          );
          setStyle(style);
        }
      });
    };

    updatePosition();

    const handleResize = () => {
      if (mounted) {
        updatePosition();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", handleResize);
      setStyle({});
    };
  }, [element, container, reset, scrollElementIntoView]);

  const getContent = () => {
    if (!renderMaskContent) {
      return null;
    }
    return renderMaskContent(<div className="w-full h-full relative" />);
  };

  const { top, left, elementWidth, elementHeight } = style as any;

  const elementRect = useMemo(() => element.getClientRects()?.[0], [element]);

  const triStyle = useMemo(() => {
    if (placement === 0) return { bottom: -9, right: 76 };
    if (placement === 1) return { bottom: -9, right: contentWidth / 2 };
    if (placement === 6)
      return {
        right: 30,
        top: -8,
        transform: "rotate(180deg)"
      };
    if (placement === 7)
      return {
        top: -9,
        left: contentWidth / 2,
        transform: "rotate(180deg)"
      };
    if ([8, 9, 10, 11].includes(placement))
      return {
        left: -26,
        top: 20,
        transform: "rotate(-90deg)"
      };
    return {};
  }, [placement]);

  return (
    <div className={styles.Mask}>
      {type === "button" ? (
        <div
          style={{
            width: elementWidth + 16,
            height: elementHeight + 16,
            left: elementRect.left,
            top: elementRect.top
          }}
          className={styles.ButtonWrapper}
        >
          <div
            style={{
              width: elementWidth + 4,
              height: elementHeight + 4
            }}
            className={styles.ButtonInner}
            dangerouslySetInnerHTML={{ __html: element.outerHTML }}
          />
        </div>
      ) : (
        <div
          style={{
            width: elementWidth + 26,
            height: elementWidth + 26,
            left: elementRect.left - elementWidth / 2,
            top: elementRect.top - elementWidth / 2
          }}
          className={styles.IconWrapper}
        >
          <div
            style={{
              width: elementWidth + 14,
              height: elementWidth + 14
            }}
            className={styles.IconInner}
            dangerouslySetInnerHTML={{ __html: element.outerHTML }}
          />
        </div>
      )}
      {top !== undefined && left !== undefined && (
        <motion.div
          animate={{
            opacity: contentWidth ? 1 : 0
          }}
          style={{
            position: "absolute",
            ...getPositionStyle(
              placement,
              top,
              left,
              elementWidth,
              elementHeight,
              contentWidth,
              contentHeight
            )
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="9"
            viewBox="0 0 15 9"
            fill="none"
            style={{
              position: "absolute",
              ...triStyle
            }}
          >
            <path d="M0 0H15L7.5 9L0 0Z" fill="#FFF3F8" />
          </svg>
          {getContent()}
        </motion.div>
      )}
    </div>
  );
};
