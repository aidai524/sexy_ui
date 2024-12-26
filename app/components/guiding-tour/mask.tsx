import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { useUserAgent } from "@/app/context/user-agent";
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
  renderMaskContent?: () => React.ReactNode;
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
  const { isMobile } = useUserAgent();

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

  const { top, left, elementWidth, elementHeight } = style as any;

  const elementRect = useMemo(() => element.getClientRects()?.[0], [element]);

  const triStyle = useMemo(() => {
    if (isMobile) {
      switch (placement) {
        case MaskPlacement.Top:
          return {
            bottom: -9,
            left:
              elementRect.left -
              elementWidth / 2 -
              (contentWidth - elementRect.left < 10 ? 14 : 4)
          };
      }
    }
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
    return {};
  }, [placement, isMobile, contentWidth, elementWidth, elementRect]);

  const [iconStyle, innerIconStyle] = useMemo(() => {
    if (element?.id === "guid-home-create-mobile") {
      return [
        {
          width: 80,
          height: 80,
          left: elementRect.left - 30,
          top: elementRect.top - 40
        },
        {
          width: 68,
          height: 68
        }
      ];
    }
    return [
      {
        width: elementWidth + 26,
        height: elementWidth + 26,
        left: elementRect.left - elementWidth / 2,
        top: elementRect.top - elementWidth / 2
      },
      {
        width: elementWidth + 14,
        height: elementWidth + 14
      }
    ];
  }, [elementRect, elementWidth]);

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
        <div style={iconStyle} className={styles.IconWrapper}>
          {element?.id === "guid-home-create-mobile" ? (
            <div style={innerIconStyle} className={styles.IconInner}>
              <div
                style={{
                  border: "3px solid #000",
                  borderRadius: 50,
                  backgroundColor: "#FF2681",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                dangerouslySetInnerHTML={{ __html: element.outerHTML }}
              />
            </div>
          ) : (
            <div
              style={innerIconStyle}
              className={styles.IconInner}
              dangerouslySetInnerHTML={{ __html: element.outerHTML }}
            />
          )}
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
              contentHeight,
              isMobile
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
          <div className="w-full h-full relative">{renderMaskContent?.()}</div>
        </motion.div>
      )}
    </div>
  );
};
