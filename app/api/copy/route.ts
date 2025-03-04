import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { URL } from "url";
import { NextRequest } from "next/server";

export async function GET(request: Request | NextRequest) {
  const parsedUrl = new URL(request.url as string);
  const imgUrl = parsedUrl.searchParams.get("imgUrl");
  const decodedImgUrl = decodeURIComponent(imgUrl || "");
  const title = parsedUrl.searchParams.get("title");
  const decodedTitle = decodeURIComponent(title || "");
  const about = parsedUrl.searchParams.get("about");
  const decodedAbout = decodeURIComponent(about || "");
  const address = parsedUrl.searchParams.get("address");
  // const referral = parsedUrl.searchParams.get("referral");
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://copytrade.flipn.fun";

  const res = new Response(
    `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="twitter:site" content="@xxx" />
            <meta name="twitter:creator" content="@xxx" />
            <meta name="twitter:card" content="summary_large_image"> <!-- Use 'summary_large_image' for large image cards -->
            <meta name="twitter:title" content="${decodedTitle}">
            <meta name="twitter:description" content="${decodedAbout}">
            <meta name="twitter:image" content="${decodedImgUrl}"> <!-- Image URL for sharing -->
            <meta http-equiv="refresh" content="0; url=${domain}/smartDetail?address=${address}&referrer=copy-trader-share">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:image:width" content="375">
            <meta property="og:image:height" content="625">
            <title>${decodedTitle}</title>
        </head>
        <body>
        
        </body>
        </html>`,
    {
      status: 200
    }
  );

  res.headers.set("Content-Type", "text/html");

  // if (referral) {
  //   res.headers.set(
  //     "Set-Cookie",
  //     [
  //       `referral=${referral};Path=/; Max-Age=31536000;`,
  //       `referral_upload_user=${referral};Path=/; Max-Age=31536000;`,
  //       `referral_upload_project=${address};Path=/; Max-Age=31536000;`
  //     ].join(", ")
  //   );
  // }

  return res;
}
