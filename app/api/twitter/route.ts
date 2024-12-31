import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { URL } from 'url';
import { NextRequest } from 'next/server';


export async function GET(request: Request | NextRequest) {
    const imgUrl = 'https://deltabot-1.s3.us-east-1.amazonaws.com/sexy/dev/Mb6Iw4eRhq222.jp'

    const res = new Response(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="twitter:site" content="@xxx" />
            <meta name="twitter:creator" content="@xxx" />
            <meta property="og:url" content="${'https://juejin.cn/post/7144186468678926373'}" />
            <meta property="og:title" content="${'你好'}" />
            <meta property="og:image" content="${imgUrl}" />
            <meta content="summary_large_image" name="twitter:card" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
        </body>
        </html>`, {
        status: 200,
    });

    res.headers.set('Content-Type', 'text/html');

    return res
}  
