import React from "react";
import { headers } from "next/headers";
import dynamic from "next/dynamic";

const HomeCom = dynamic(() => import("./sections/home"), {
  ssr: false
});

export default async function Home() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  console.log(userAgent);
  return <HomeCom />;
}
