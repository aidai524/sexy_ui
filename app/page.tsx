import React from "react";
import dynamic from "next/dynamic";

const HomeCom = dynamic(() => import("./sections/home"), {
  ssr: false
});

export default function Home() {
  // return <div></div>
  return <HomeCom />;
}
