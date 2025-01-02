import { Toast } from "antd-mobile";

const customStyle: any = {
  whiteSpace: 'normal', 
  wordBreak: 'break-word'
}

export function success(msg: string | React.ReactNode) {
  Toast.show({
    content: <div style={{ color: "#AAFF00", ...customStyle }}>{msg}</div>,
    position: "top",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="14" cy="14" r="13" stroke="#AAFF00" strokeWidth="2" />
        <path
          d="M8.79999 13.5667L12.2667 17.0333L18.7667 10.5333"
          stroke="#AAFF00"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    duration: 20000000
  });
}

export function fail(msg: string) {
  Toast.show({
    content: <div style={{ color: "#FF2681", ...customStyle  }}>{msg}</div>,
    position: "top",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="14"
          cy="14"
          r="13"
          stroke="#FF2681"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 7.5V14.8667"
          stroke="#FF2681"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M14 19.2V20.0666"
          stroke="#FF2681"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    duration: 2000
  });
}
