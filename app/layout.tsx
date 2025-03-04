"use client";

import "./globals.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import Layout from "./components/layout";
import WalletConnect from "./components/WalletConnect";
import { UserAgentProvider } from "@/app/context/user-agent";
import { Suspense } from "react";
import TGProvider from "./context/TGProvider";
import PrivyWalletProvider from "@/app/context/privy";
import Script from "next/script";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // useEffect(() => {
  //   if (!window.navigator.userAgent.includes("Mobile")) return;
  //   window.AddToHomeScreenInstance = window?.AddToHomeScreen?.({
  //     appName: "Fun",
  //     appNameDisplay: "standalone",
  //     appIconUrl: "/192x192.png",
  //     assetUrl: "/libs/add_to_homescreen/img/", // Link to directory of library image assets.

  //     maxModalDisplayCount: 1, // If set, the modal will only show this many times.
  //     // [Optional] Default: -1 (no limit).  (Debugging: Use this.clearModalDisplayCount() to reset the count)
  //     displayOptions: { showMobile: true, showDesktop: true }, // show on mobile/desktop [Optional] Default: show everywhere
  //     allowClose: true
  //   });
  //   window.AddToHomeScreenInstance?.show("en"); // show "add-to-homescreen" instructions to user, or do nothing if already added to homescreen
  // }, []);

  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no"
        />
        {/* <link rel="stylesheet" href="/libs/add_to_homescreen/index.css" /> */}
        <link rel="manifest" href="/manifest.json" />
        <title>Fun</title>
        {/* <script async src="/libs/add_to_homescreen/index.js" /> */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4TLCL3TJDR"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4TLCL3TJDR');
            `
          }}
        />
      </head>
      <body>
        <TGProvider>
          <PrivyWalletProvider>
            <WalletConnect>
              <UserAgentProvider>
                <Suspense>
                  <Layout>{children}</Layout>
                </Suspense>
              </UserAgentProvider>
            </WalletConnect>
          </PrivyWalletProvider>
        </TGProvider>
      </body>
    </html>
  );
}
