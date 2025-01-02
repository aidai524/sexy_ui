import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { URL } from 'url';
import { NextRequest } from 'next/server';


export async function GET(request: Request | NextRequest) {
    const parsedUrl = new URL(request.url as string);
    const imgUrl = parsedUrl.searchParams.get('imgUrl')
    const tokenName = parsedUrl.searchParams.get('tokenName')
    const about = parsedUrl.searchParams.get('about')
    const tokenId = parsedUrl.searchParams.get('tokenId')
    const referral = parsedUrl.searchParams.get('referral')

    const res = new Response(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="twitter:site" content="@xxx" />
            <meta name="twitter:creator" content="@xxx" />
            <meta name="twitter:card" content="summary_large_image"> <!-- Use 'summary_large_image' for large image cards -->
            <meta name="twitter:title" content="${tokenName}">
            <meta name="twitter:description" content="${about}">
            <meta name="twitter:image" content="${imgUrl}"> <!-- Image URL for sharing -->

            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="refresh" content="1; url=https://test.flipn.fun/detail?id=${tokenId}">
            <title>${tokenName}</title>
        </head>
        <body>
        <img src="${imgUrl}" style="width: 100%" />
        </body>
        </html>`, {
        status: 200,
    });

    res.headers.set('Content-Type', 'text/html');
    if (referral) {
        res.headers.set("Set-Cookie", `referral=${referral};Path=/;`);
    }

    return res
}  
