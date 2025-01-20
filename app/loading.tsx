import LoadingIcon from "@/app/sections/home/mobile/loading";

export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <LoadingIcon />
    </div>
  );
}
