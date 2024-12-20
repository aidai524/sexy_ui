"use client";

import dynamic from "next/dynamic";

const Section = dynamic(() => import("../sections/trends"), {
  ssr: false
});

export default function Trends() {
  return <Section />;
}
