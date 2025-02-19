import { useUserAgent } from "@/app/context/user-agent";
import styles from "./style.module.css";
import MainBtn from "@/app/components/mainBtn";
import type { ReactNode } from "react";
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";

export default function StepAction({
    step,
    isLoading = false,
    extendBtn,
    btnText = 'Continue',
    onBack,
    onNext,
}: {
    step: number;
    isLoading?: boolean;
    extendBtn?: ReactNode;
    btnText?: string;
    onBack: () => void;
    onNext: () => void;
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

            {extendBtn}

            <MainBtn style={{ color: '#000', fontWeight: 500 }} isLoading={isLoading} onClick={onNext}>{btnText}</MainBtn>
        </div>
    );
}
