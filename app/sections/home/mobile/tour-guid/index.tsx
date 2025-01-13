import { useEffect } from "react";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useGuidingTour } from "@/app/store/use-guiding-tour";
export default function TourGuid() {
  const [step2Info, setStep2Info] = useState<any>({});
  const [step3Info, setStep3Info] = useState<any>({});
  const [step, setStep] = useState(0);
  const guidingTourStore = useGuidingTour();

  useEffect(() => {
    if (guidingTourStore.hasShownTour) return;
    setTimeout(() => {
      setStep(1);
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
            left: likeElementRect.left + 22,
            top: likeElementRect.top + likeElementRect.height - 8
          }
        });
      }
    }, 2000);
  }, []);
  return (
    !guidingTourStore.hasShownTour &&
    step > 0 && (
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
          height: window.innerHeight
        }}
      >
        {/* step 1 */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Image
              src="/img/home/guid-step-1.png"
              width={177}
              height={194}
              alt="Guid step one"
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
            <div
              className={styles.Flip}
              style={step3Info?.contentStyle}
              dangerouslySetInnerHTML={{ __html: step3Info?.content }}
            />
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
      </div>
    )
  );
}
