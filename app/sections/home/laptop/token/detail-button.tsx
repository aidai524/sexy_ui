import TipsButton from "../../laptop/tips-button";
import { useUserAgent } from "@/app/context/user-agent";

export default function DetailButton(props: any) {
  const { isMobile } = useUserAgent();

  return isMobile ? (
    <Button {...props} />
  ) : (
    <TipsButton tips="Details">
      <Button {...props} />
    </TipsButton>
  );
}
function Button({ onClick }: any) {
  const { isMobile } = useUserAgent();
  const theme = isMobile ? "dark" : "light";
  return (
    <button
      className="button"
      onClick={onClick}
      style={{
        marginBottom: 20,
        width: 42,
        height: 42,
        borderRadius: 42,
        backgroundColor: theme === "light" ? "#ffffff1a" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="18"
        viewBox="0 0 12 18"
        fill="none"
        style={{ marginLeft: 1 }}
      >
        <path
          d="M2 2L9 9L2 16"
          stroke={theme === "light" ? "white" : "black"}
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </button>
  );
}
