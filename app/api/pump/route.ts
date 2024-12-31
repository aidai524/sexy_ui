import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { URL } from 'url';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { NextRequest } from 'next/server';
// const { spawn } = require('child_process');

const prefix = 'https://frontend-api.pump.fun/coins/'

export async function GET(request: Request | NextRequest) {
    const params: any = {}
    if (process.env.NODE_ENV === 'development') {
        params.agent = new HttpsProxyAgent('http://127.0.0.1:4780');
    }

    const parsedUrl = new URL(request.url as string);

    const token = parsedUrl.searchParams.get('token')

    console.log('token:', token)

    const v = await fetch(prefix + token, params)

    // console.log('v:', await v.json())

    // const command = spawn('curl', ['--location', 'https://frontend-api.pump.fun/coins/526d8UxmsTQJKN9bbsZsjaYShzRMnPBPQuniBnC1K3Ao']);

    // command.stdout.on('data', (data: any) => {
    //     console.log(`stdout: ${data}`);
    // });

    // command.stderr.on('data', (data: any) => {
    //     console.error(`stderr: ${data}`);
    // });

    // command.on('close', (code: any) => {
    //     console.log(`child process exited with code ${code}`);
    // });

    return new Response(JSON.stringify(await v.json()), {
        status: 200,
    });
}  
