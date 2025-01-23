import Script from "next/script";
import { createContext, useContext, useEffect } from "react";
import { getDeviceType, sleep } from "../utils";
import { isTelegram } from "../utils/common";

export interface TGContextExposes {
  isTelegram: boolean;
}

const TGContext = createContext({} as TGContextExposes);

export function useTGContext() {
  return useContext(TGContext);
}

const isTG = isTelegram();
export default function TGProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  async function handleInitTg() {
    await sleep(500);
    console.log(
      "window?.Telegram?.WebApp :>> ",
      (window?.Telegram as any)?.WebApp
    );
    (window?.Telegram as any)?.WebApp?.expand();
  }

  const exposes = {
    isTelegram: isTG,
  };

  return (
    <>
      <TGContext.Provider value={exposes}>{children}</TGContext.Provider>
      {isTG && (
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          onLoad={handleInitTg}
        />
      )}
    </>
  );
}
