import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Mask } from "./mask";
import { MaskPlacement } from "./get-style-rect";
import { useGuidingTour } from "@/app/store/use-guiding-tour";
import styles from "./index.module.css";

export interface IGuidingTourProps {
  steps: GuidingTourStepConfig[];
  getContainer?: () => HTMLElement;
  onStepsEnd?: () => void;
  forceShow?: boolean;
}

export interface GuidingTourStepConfig {
  selector: () => HTMLElement | null;
  placement?: MaskPlacement;
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  renderContent?: () => React.ReactNode;
  beforeForward?: (currentStep: number) => void;
  beforeBack?: (currentStep: number) => void;
  type?: string;
}

const GuidingTour: FC<IGuidingTourProps> = (props) => {
  const { steps, onStepsEnd, getContainer } = props;
  const { hasShownTour, setHasShownTour } = useGuidingTour();

  const [currentStep, setCurrentStep] = useState<number>(-1);
  const currentSelectedElement = steps[currentStep]?.selector();
  const currentContainerElement = getContainer?.() || document.body;
  const [done, setDone] = useState(false);
  const [isMaskMoving, setIsMaskMoving] = useState<boolean>(false);
  const [, setRenderTick] = useState<number>(0);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isResetting, setIsResetting] = useState(false);

  const getCurrentStep = () => {
    return steps[currentStep];
  };

  const handleTourEnd = useCallback(async () => {
    setIsResetting(true);
    await onStepsEnd?.();
    setDone(true);
    setHasShownTour(true);
    setContentSize({ width: 0, height: 0 });
  }, [onStepsEnd, setHasShownTour]);

  const forward = async () => {
    if (currentStep === steps.length - 1) {
      await handleTourEnd();
      return;
    }

    const { beforeForward } = getCurrentStep();
    await beforeForward?.(currentStep);
    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    let timer: any = null;
    const check = () => {
      if (popoverRef.current) {
        setContentSize({
          width: popoverRef.current.offsetWidth,
          height: popoverRef.current.offsetHeight
        });
        clearTimeout(timer);
      } else {
        timer = setTimeout(() => {
          check();
        }, 1000);
      }
    };
    check();
  }, [popoverRef.current, currentStep]);

  const renderPopover = () => {
    const config = getCurrentStep();

    if (!config) {
      return null;
    }

    const { content } = config;

    const operation = (
      <button className={styles.Button} onClick={() => forward()}>
        {currentStep === steps.length - 1 ? (
          "Got it"
        ) : (
          <>
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="10"
              viewBox="0 0 7 10"
              fill="none"
            >
              <path
                d="M1 0.842773L5.24264 5.08541L1 9.32806"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </>
        )}
      </button>
    );

    return isMaskMoving ? null : (
      <div ref={popoverRef} className={styles.Panel}>
        <div className={styles.Text}>{content}</div>
        <div style={{ height: 30 }}>{operation}</div>
      </div>
    );
  };

  useEffect(() => {
    setRenderTick(1);
    setCurrentStep(0);
  }, []);

  if ((!props?.forceShow && hasShownTour) || !currentSelectedElement || done) {
    return null;
  }

  const mask = (
    <Mask
      reset={isResetting}
      onAnimationStart={() => {
        setIsMaskMoving(true);
      }}
      onAnimationEnd={() => {
        setIsMaskMoving(false);
      }}
      placement={getCurrentStep().placement as unknown as MaskPlacement}
      container={currentContainerElement}
      element={currentSelectedElement}
      renderMaskContent={renderPopover}
      contentWidth={contentSize.width}
      contentHeight={contentSize.height}
      type={getCurrentStep().type}
    />
  );

  return createPortal(mask, currentContainerElement);
};

export default GuidingTour;
