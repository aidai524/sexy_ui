"use client";

import type { Metadata } from "next";
import "./globals.css";
import Layout from "./components/layout";
import WalletConnect from "./components/WalletConnect";
import { MessageContextProvider } from "./context/messageContext";


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
            <Layout>{children}</Layout>
          </WalletConnect>
        </MessageContextProvider>
      </body>
    </html>
  );
}
