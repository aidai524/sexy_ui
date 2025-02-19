import ReactDOM from "react-dom";

export default function ProgressBar({
  progress,
  videoProgressStyle = {}
}: any) {
  return ReactDOM.createPortal(
    (
      <div
        style={{
          width: "calc(100vw - 32px)",
          height: 2,
          backgroundColor: "#3C3C3C80",
          backdropFilter: "blur(5px)",
          borderRadius: "12px",
          ...videoProgressStyle
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 2,
            backgroundColor: "#fff",
            borderRadius: "12px",
            width: progress * 100 + "%"
          }}
        />
      </div>
    ) as any,
    document.body
  );
}
