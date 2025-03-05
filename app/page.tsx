"use client";

import React from "react";
import HomeCom from "./sections/home";
import InviteCodeView from '@/app/sections/invite-code';
import { useUser } from '@/app/store/useUser';

export default function Home() {
  const { userInfo } = useUser();

  return !!userInfo?.allow_login ? (
    <HomeCom />
  ) : (
    <div
      style={{
        position: "fixed",
        zIndex: 800,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0d0d0d"
      }}
    >
      <InviteCodeView />
    </div>
  );
}
