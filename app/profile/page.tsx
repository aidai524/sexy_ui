"use client";

import dynamic from "next/dynamic";

const ProfileCom = dynamic(() => import("../sections/profile/index"), {
  ssr: false
});

export default function Prpfile() {
  return <ProfileCom />;
}
