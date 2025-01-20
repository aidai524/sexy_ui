import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { URL } from "url";
import { NextRequest } from "next/server";


export async function GET(request: Request | NextRequest) {
    const parsedUrl = new URL(request.url as string);
    const imgUrl = parsedUrl.searchParams.get("imgUrl");
    const tokenName = parsedUrl.searchParams.get("tokenName");
    const about = parsedUrl.searchParams.get("about");
    const tokenAddress = parsedUrl.searchParams.get("address");
    const referral = parsedUrl.searchParams.get("referral");
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://stage.flipn.fun'
    const s3Domain = process.env.NEXT_PUBLIC_S3_URL_PREFIX || 'https://flipn.s3.us-east-1.amazonaws.com'
    const s3Dir = process.env.NEXT_PUBLIC_S3_DIR || 'flipn/stg/'

    const res = new Response(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="twitter:site" content="@xxx" />
            <meta name="twitter:creator" content="@xxx" />
            <meta name="twitter:card" content="summary_large_image"> <!-- Use 'summary_large_image' for large image cards -->
            <meta name="twitter:title" content="${tokenName}">
            <meta name="twitter:description" content="${about}">
            <meta name="twitter:image" content="${s3Domain}/${s3Dir}${imgUrl}"> <!-- Image URL for sharing -->
            <meta http-equiv="refresh" content="0; url=${domain}/detail?address=${tokenAddress}">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:image:width" content="375">
            <meta property="og:image:height" content="625">
            <title>${tokenName}</title>
        </head>
        <body>
        <script>
          window.location.href = "${domain}/detail?address=${tokenAddress}"
        </script>
        </body>
        </html>`,
        {
            status: 200
        }
    );

    res.headers.set("Content-Type", "text/html");


    if (referral) {
        res.headers.set("Set-Cookie", [
            `referral=${referral};Path=/; Max-Age=31536000;`,
            `referral_upload_user=${referral};Path=/; Max-Age=31536000;`,
            `referral_upload_project=${tokenAddress};Path=/; Max-Age=31536000;`
        ].join(", "));
    }

    return res;
}
