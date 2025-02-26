import styles from './index.module.css'

const Steps = ({ step }: any) => {
    return (
        <div className={styles.Steps}>
            {step === 1 && <div className={styles.StepCircle} />}
            <span style={{ opacity: step !== 1 ? 0.5 : 1 }}>Token Info</span>
            <svg width="95" height="2" viewBox="0 0 95 2" fill="none" style={{ margin: "0px 10px" }} xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H94.5" stroke="#353339" />
            </svg>

            {step === 2 && <div className={styles.StepCircle} />}
            <span style={{ opacity: step !== 2 ? 0.5 : 1 }}>Preview</span>
            <svg width="95" height="2" viewBox="0 0 95 2" style={{ margin: "0px 10px" }} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H94.5" stroke="#353339" />
            </svg>

            {step === 3 && <div className={styles.StepCircle} />}
            <div className={styles.GetShare} style={{ opacity: step !== 3 ? 0.5 : 1 }}>
                <span>Get Share</span>
                <span className={styles.Optional}>Optional</span>
            </div>
        </div>
    );
};

export default Steps