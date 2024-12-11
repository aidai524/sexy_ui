import React from "react";
import CircleLoading from "@/app/components/icons/loading";

export default function Loading() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        left: "0px",
        top: "0px",
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <CircleLoading size={40} />
    </div>
  );
}
