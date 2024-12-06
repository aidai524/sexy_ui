import type { Project } from "../type"
import { fail } from "./toast"

const BASE_URL = 'https://api.dumpdump.fun/api/v1'
// const BASE_URL = '/api/v1'

const AUTH_KEY = 'sex-ui-auth'

export function http(path: string, method: string, params?: any, headers?: any) {
    let _path = path, postBody = {}
    if (method === 'GET' && params) {
        const _paramsString = Object.keys(params).map(key => {
            return `${key}=${encodeURIComponent(params[key])}`
        }).join('&')
        if (path.indexOf('?') > -1) {
            _path = `${_path}&${_paramsString}`
        } else {
            _path = `${_path}?${_paramsString}`
        }
    } else if (method === 'POST') {
        postBody = {
            body: JSON.stringify(params),
        }
    }

    let _header = headers ? {
        headers: headers
    } : {
        headers: {
            authorization: getAuthorizationByLocal()
        }
    }

    return fetch(`${BASE_URL}${_path}`, {
        method: method,
        ...postBody,
        ..._header,
    }).then(res => res.json())
}

export function httpGet(path: string, params?: any) {
    return http(path, 'GET', params)
}

export async function httpAuthGet(path: string, params?: any) {
    const authorization = await getAuthorization()
    const header = {
        authorization
    }
    return http(path, 'GET', params, header)
}

export async function httpAuthPost(path: string, params?: any) {
    const authorization = await getAuthorization()
    const header = {
        authorization
    }
    const val = await http(path, 'POST', params, header)

    if (typeof (val.code) !== 'undefined') {
        if (val.code === 500) {
            window.localStorage.removeItem(AUTH_KEY)
            return await httpAuthPost(path, params)
        } else if (val.code !== 0) {
            fail(val.message)
            return null
        } else {
            return val
        }
    }
}

export async function httpAuthPut(path: string, params?: any) {
    const authorization = await getAuthorization()
    const header = {
        authorization
    }
    const val = await http(path, 'PUT', params, header)

    if (typeof (val.code) !== 'undefined') {
        if (val.code === 500) {
            window.localStorage.removeItem(AUTH_KEY)
            return await httpAuthPut(path, params)
        } else if (val.code !== 0) {
            fail(val.message)
            return null
        } else {
            return val
        }
    }
}

export async function bufferToBase64(buffer: Uint8Array) {
    const base64url: any = await new Promise(r => {
        const reader = new FileReader()
        reader.onload = () => r(reader.result)
        reader.readAsDataURL(new Blob([buffer]))
    });
    return base64url.slice(base64url.indexOf(',') + 1);
}


let isInitingAuthorization = false, authorization: string | undefined
const watingQuene: any[] = []

export async function getAuthorization() {
    authorization = getAuthorizationByLocal()
    if (isInitingAuthorization || !authorization) {
        return new Promise((resolve, reject) => {
            watingQuene.push(resolve)
        })
    }

    return authorization
}

export function getAuthorizationByLocal() {
    return window.localStorage.getItem(AUTH_KEY)?.toString()
}


export async function initAuthorization(walletProvider: any, address: string) {
    isInitingAuthorization = true
    const now = Date.now()
    const text = `login sexy,time:${now}`
    const encodedMessage = new TextEncoder().encode(text)
    const signMessage = await walletProvider!.signMessage(encodedMessage)
    // console.log('signMessage:', signMessage)

    const b64encoded = await bufferToBase64(signMessage)
    console.log('b64encoded', b64encoded)

    const v = await httpGet('/account/token', {
        address,
        signature: b64encoded,
        time: now
    })

    if (v.data) {
        window.localStorage.setItem(AUTH_KEY, v.data)
    } else {
        return
    }

    authorization = v.data

    while (watingQuene.length) {
        const _reslove = watingQuene.shift()
        _reslove(v.data)
    }
}


export function getFullNum(value: any) {
    try {
        let x = value;
        if (Math.abs(x) < 1.0) {
            const e = parseInt(x.toString().split('e-')[1]);
            if (e) {
                x *= Math.pow(10, e - 1);
                x = '0.' + new Array(e).join('0') + x.toString().substring(2);
            }
        } else {
            let e = parseInt(x.toString().split('+')[1]);
            if (e > 20) {
                e -= 20;
                x /= Math.pow(10, e);
                x += new Array(e + 1).join('0');
            }
        }
        return x;
    } catch (e) { }

    return value;
}

export function sleep(time: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

export function mapDataToProject(currentToken: any): Project {
    return {
        id: currentToken.id,
        tokenName: currentToken.token_name,
        ticker: currentToken.ticker,
        about: currentToken.about_us,
        website: currentToken.website,
        tokenImg: currentToken.icon || 'https://pump.mypinata.cloud/ipfs/QmYy8GNmqXVDFsSLjPipD5WGro81SmXpmG7ZCMZNHf6dnp?img-width=800&img-dpr=2&img-onerror=redirect',
        isLike: currentToken.is_like,
        isUnLike: currentToken.isUnLike,
        isSuperLike: currentToken.isSuperLike,
        like: currentToken.like,
        unLike: currentToken.un_like,
        superLike: currentToken.super_like,
        time: currentToken.time,
        account: currentToken.account,
    }
}

const addressReg = /(\w{5}).+(\w{5})/
export function formatAddress(address: string) {
    if (!address) {
        return ''
    }

    if (address.length > 12) {
        return address.replace(addressReg, ($1, $2, $3) => {
            return $2 + '....' + $3
        })
    }
}

export function formatDateTime(_datetime: any, formatStr: string = 'YYYY-MM-DD hh:mm:ss') {
    if (!_datetime) return '';
    const datetime = new Date(_datetime);
    const values: any = {
        'M+': datetime.getMonth() + 1,
        'D+': datetime.getDate(),
        'h+': datetime.getHours(),
        'm+': datetime.getMinutes(),
        's+': datetime.getSeconds(),
        S: datetime.getMilliseconds()
    };
    let fmt = formatStr;
    const reg = /(Y+)/;
    if (reg.test(fmt)) {
        const y = (reg.exec(fmt) as string[])[1];
        fmt = fmt.replace(y, (datetime.getFullYear() + '').substring(4 - y.length));
    }
    for (const k in values) {
        const regx = new RegExp('(' + k + ')');
        if (regx.test(fmt)) {
            const t = (regx.exec(fmt) as string[])[1];
            fmt = fmt.replace(t, t.length === 1 ? values[k] : ('00' + values[k]).substring(('' + values[k]).length));
        }
    }
    return fmt;
}

export async function upload(fileName: string, file: File) {
    const newFileName = generateRandomString(10) + fileName
    const val = await httpAuthPost(`/upload/data?dir=${encodeURIComponent('sexy/dev/')}&file_name=${newFileName}`)
    if (val?.code === 0) {
        const res = await fetch(val.data, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });

          if (!res.ok) {
            fail('Upload fail')
            return null
          }

          return `https://deltabot-1.s3.us-east-1.amazonaws.com/sexy/dev/${newFileName}`
    }

    return null
}

function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}