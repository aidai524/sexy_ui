import { useUserAgent } from "@/app/context/user-agent";
import styles from "./style.module.css";
import MainBtn from "@/app/components/mainBtn";
import type { ReactNode } from "react";
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";
import { backgroundClip } from "html2canvas/dist/types/css/property-descriptors/background-clip";

export default function StepAction({
    step,
    disabled = false,
    isLoading = false,
    extendBtn,
    btnText = 'Continue',
    onBack,
    onNext,
}: {
    step: number;
    disabled?: boolean;
    isLoading?: boolean;
    extendBtn?: ReactNode;
    btnText?: string;
    onBack: () => void;
    onNext: () => void;
}) {
    const { isMobile } = useUserAgent();   

    if (!isMobile && step === 4) {
        return <div className={styles.btnWapper4Pc}>
            <div onClick={onBack} className={styles.backBtn}>Back</div>
            <div className={styles.btnWapper4PcAction}>
                <MainBtn loadingStyle='#fff' isDisabled={disabled} style={{ color: '#fff', marginRight: '10px', backgroundColor: 'transparent', border: '1px solid #FBCA04', fontWeight: 500, height: '40px', fontSize: '14px', width: isMobile ? '100%' : '160px' }} isLoading={isLoading} onClick={onNext}>Skip</MainBtn>
                <MainBtn isDisabled={disabled} style={{ color: '#000', fontWeight: 500, height: '40px', fontSize: '14px', width: isMobile ? '100%' : '160px' }} isLoading={isLoading} onClick={onNext}>Get</MainBtn>
            </div>
        </div>;
    }

    return (
        <div className={styles.btnWapper + ' ' + (isMobile ? styles.btnWapperMobile : styles.btnWapperPc)}>
            {
                step > 1 && !isMobile && (
                    <div onClick={onBack} className={styles.backBtn}>Back</div>
                )
            }

            {extendBtn}

            <MainBtn isDisabled={disabled} style={{ color: '#000', fontWeight: 500, height: '40px', fontSize: '14px', width: isMobile ? '100%' : '160px' }} isLoading={isLoading} onClick={onNext}>{btnText}</MainBtn>
        </div>
    );
}
