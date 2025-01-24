"use client";
import AirdropView from "@/app/sections/airdrop";
import { useConfig } from "../store/useConfig";
import { redirect } from "next/navigation";

const Airdrop = () => {
  const configStore: any = useConfig();
  if (!configStore.config.showAirdropEntry || configStore.config.airdropReady) {
    redirect("/");
  }
  return <AirdropView />;
};

export default Airdrop;
