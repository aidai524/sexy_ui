import { solana_api_key } from './config'

const api_prefix = 'https://pro-api.solscan.io/v2.0'

export async function getTokenByHolder(address: string, page: number = 1, pageSize: number = 40) {
    return fetch(`${api_prefix}/account/token-accounts?hide_zero=true&type=token&page=${page}&page_size=${pageSize}&address=${'2fQNodficSfTs7KF689XwAWo8oLnUZ5wuiEgozG2YE74'}`, {
        headers: {
            token: solana_api_key
        }
    }).then(res => res.json())
}

export async function getHoldersByToken(address: string, page: number = 1, pageSize: number = 40) {
    return fetch(`${api_prefix}/token/holders?address=${'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'}&page=${page}&page_size=${pageSize}`, {
        headers: {
            token: solana_api_key
        }
    }).then(res => res.json()).then(res => res.data)
}
