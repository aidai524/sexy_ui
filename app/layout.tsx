"use client";

import "./globals.css";
import Layout from "./components/layout";
import WalletConnect from "./components/WalletConnect";
import { MessageContextProvider } from "./context/messageContext";
import { UserAgentProvider } from "@/app/context/user-agent";
import { useUser } from "./store/useUser";
import { useAccount } from "./hooks/useAccount";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        <MessageContextProvider>
          <WalletConnect>
            <UserAgentProvider>
              <Layout>{children}</Layout>
            </UserAgentProvider>
          </WalletConnect>
        </MessageContextProvider>
      </body>
    </html>
  );
}
