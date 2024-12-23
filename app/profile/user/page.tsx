"use client";

import dynamic from "next/dynamic";

const ProfileCom = dynamic(() => import("@/app/sections/profile"), {
  ssr: false
});

export default function Prpfile() {
  return <ProfileCom isOther={true} />;
}
