import { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "../actions/like";
import { useState } from "react";
import { useGuidingTour } from "@/app/store/use-guiding-tour";
import { useUserAgent } from "@/app/context/user-agent";

export default function TourGuid() {
  const [step2Info, setStep2Info] = useState<any>({});
  const [step3Info, setStep3Info] = useState<any>({});
  const [step, setStep] = useState(0);
  const guidingTourStore = useGuidingTour();
  const { innerHeight } = useUserAgent();

  useEffect(() => {
    setTimeout(() => {
      const flipElement = document.getElementById("guid-tour-flip");
      if (flipElement) {
        const flipElementRect = flipElement.getClientRects()?.[0];
        setStep2Info({
          content: flipElement.outerHTML,
          contentStyle: {
            left: flipElementRect.left,
            top: flipElementRect.top
          }
        });
      }

      const likeElement = document.getElementById("guid-tour-like");

      if (likeElement) {
        const likeElementRect = likeElement.getClientRects()?.[0];
        setStep3Info({
          content: likeElement.outerHTML,
          contentStyle: {
            left: likeElementRect.left,
            top: likeElementRect.top
          }
        });
      }

      if (flipElement && likeElement) {
        setStep(1);
      }
    }, 2000);
  }, []);
  return (
    step > 0 &&
    ReactDOM.createPortal(
      <div
        className={styles.Container}
        onClick={() => {
          if (step === 3) {
            guidingTourStore.setHasShownTour(true);
            return;
          }
          setStep(step + 1);
        }}
        style={{
          height: innerHeight
        }}
      >
        {/* step 1 */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Image
              src="/img/home/guid-step-1.png"
              width={177}
              height={192}
              alt="Guid step one"
            />
            <Image
              src="/img/home/guid-step-1-1.gif"
              width={116}
              height={116}
              alt="Guid step one"
              style={{
                position: "absolute",
                left: "calc(50vw - 20px)"
              }}
            />
          </motion.div>
        )}
        {/* step 2 */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div
              className={styles.Flip}
              style={step2Info?.contentStyle}
              dangerouslySetInnerHTML={{ __html: step2Info?.content }}
            />
            <Image
              src="/img/home/guid-step-2-1.png"
              width={118}
              height={80}
              alt="Guid step two"
              className={styles.FlipImage}
              style={{
                left: step2Info.contentStyle.left + 130,
                top: step2Info.contentStyle.top + 26
              }}
            />
            <Image
              src="/img/home/guid-step-2-2.png"
              width={185}
              height={95}
              alt="Guid step two"
              className={styles.FlipImage}
              style={{
                left: step2Info.contentStyle.left + 40,
                top: step2Info.contentStyle.top - 94
              }}
            />
            <Image
              src="/img/home/guid-step-2-3.png"
              width={292}
              height={100}
              alt="Guid step two"
              className={styles.FlipImage}
              style={{
                left: step2Info.contentStyle.left + 30,
                top: step2Info.contentStyle.top + 56
              }}
            />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.Flip} style={step3Info?.contentStyle}>
              <Heart
                isLiked={false}
                like={0}
                style={{
                  bottom: 10
                }}
              />
              <div className={styles.FlipNum}>0</div>
            </div>
            <Image
              src="/img/home/guid-step-3.png"
              width={316}
              height={227}
              alt="Guid step three"
              className={styles.FlipImage}
              style={{
                left: step3Info.contentStyle.left - 290,
                top: step3Info.contentStyle.top - 170
              }}
            />
          </motion.div>
        )}
      </div>,
      document.body
    )
  );
}
