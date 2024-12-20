import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const utl = 'https://api-v2.solscan.io/v2/rpc-devnet'

export async function GET(request: NextApiRequest, y: any, z: any) {

  const v = await fetch(utl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'origin': 'https://solscan.io'
    },
    body: JSON.stringify({
      "method": "getSignaturesForAddress",
      "jsonrpc": "2.0",
      "params": [
        "JCgRH43ruTB1FZ36UJyGEFwxpXdxNrFxRjNM42WkwSci",
        {
          "encoding": "jsonParsed",
          "limit": 5,
          "before": null
        }
      ],
      "id": 1
    })
  })


  // console.log('v:', await v.text())

  return new Response(JSON.stringify(request), {
    status: 200,
  });
}  
