import { useUserAgent } from "@/app/context/user-agent";
import styles from "./style.module.css";
import MainBtn from "@/app/components/mainBtn";

export default function StepAction({
    step,
    onBack,
    onNext,
    onPreview
}: {
    step: number;
    onBack: () => void;
    onNext: () => void;
    onPreview: (step: number) => Promise<boolean>;
}) {
    const { isMobile } = useUserAgent();    

    if (!isMobile) {
        return null
    }

    return (
        <div className={styles.btnWapper}>
            {
                step > 1 && (
                    <div onClick={onBack} className={styles.backBtn}>Back</div>
                )
            }

            <MainBtn onClick={async () => {
                if (step === 1) {
                    const isValid = await onPreview(1);
                    if (!isValid) {
                        onNext();
                    }
                } else {
                    const isValid = await onPreview(2);
                    console.log(isValid);

                    if (!isValid) {
                        onNext();
                    }
                }
            }}>Continue</MainBtn>
        </div>
    );
}
