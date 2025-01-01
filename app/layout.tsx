"use client";

import "./globals.css";
import Layout from "./components/layout";
import WalletConnect from "./components/WalletConnect";
import { MessageContextProvider } from "./context/messageContext";
import { UserAgentProvider } from "@/app/context/user-agent";
import { Suspense, useEffect } from "react";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!window.navigator.userAgent.includes("Mobile")) return;
    window.AddToHomeScreenInstance = window?.AddToHomeScreen?.({
      appName: "FlipN",
      appNameDisplay: "standalone",
      appIconUrl: "/192x192.png",
      assetUrl: "/libs/add_to_homescreen/img/", // Link to directory of library image assets.

      maxModalDisplayCount: 1, // If set, the modal will only show this many times.
      // [Optional] Default: -1 (no limit).  (Debugging: Use this.clearModalDisplayCount() to reset the count)
      displayOptions: { showMobile: true, showDesktop: true }, // show on mobile/desktop [Optional] Default: show everywhere
      allowClose: true
    });
    window.AddToHomeScreenInstance?.show("en"); // show "add-to-homescreen" instructions to user, or do nothing if already added to homescreen
  }, []);

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="stylesheet" href="/libs/add_to_homescreen/index.css" />
        <link rel="manifest" href="/manifest.json" />
        <title>FlipN</title>
        <script async src="/libs/add_to_homescreen/index.js" />
      </head>
      <body>
        <WalletConnect>
        <UserAgentProvider>
          <MessageContextProvider>
              <Suspense>
                <Layout>{children}</Layout>
              </Suspense>
          </MessageContextProvider>
          </UserAgentProvider>
        </WalletConnect>
      </body>
    </html>
  );
}
