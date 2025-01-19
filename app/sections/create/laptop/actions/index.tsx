import styles from "./index.module.css";
export default function Actions({ step, onClick }: any) {
  return (
    <div className={styles.Container}>
      <Steps step={step} />
      <div className={styles.Buttons}>
        {step === "edit" ? (
          <button
            onClick={() => {
              onClick("preview");
            }}
            className={`button ${styles.Button} ${styles.SolidButton}`}
          >
            Preview
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                onClick("edit");
              }}
              className={`button ${styles.Button} ${styles.SolidButton}`}
            >
              Edit
            </button>
            <button
              onClick={() => {
                onClick("create");
              }}
              className={`button ${styles.Button} ${styles.PrimaryButton}`}
            >
              Create
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const Steps = ({ step }: any) => {
  return (
    <div className={styles.Steps}>
      <div className={styles.StepCircle} />
      <span>Edit</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="138"
        height="2"
        viewBox="0 0 138 2"
        fill="none"
        style={{
          margin: "0px 15px",
          opacity: step === "edit" ? 0.3 : 1
        }}
      >
        <path
          d="M1 1L137 1.00002"
          stroke="white"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
      </svg>
      <div
        className={styles.StepCircle}
        style={{
          opacity: step === "edit" ? 0.3 : 1
        }}
      />
      <span
        style={{
          opacity: step === "edit" ? 0.3 : 1
        }}
      >
        Preview
      </span>
    </div>
  );
};
