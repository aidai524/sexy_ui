const BASE_URL = 'http://103.140.239.8:8081/api/v1'

export function http(path: string, method: string, params?: any, header?: any) {
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

    let _header = header || {}

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

export async function bufferToBase64(buffer: Uint8Array) {
    // use a FileReader to generate a base64 data URI:
    const base64url: any = await new Promise(r => {
        const reader = new FileReader()
        reader.onload = () => r(reader.result)
        reader.readAsDataURL(new Blob([buffer]))
    });
    // remove the `data:...;base64,` part from the start
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
    return window.localStorage.getItem('sex-ui')?.toString()
}


export async function initAuthorization(walletProvider: any, address: string) {
    isInitingAuthorization = true
    const now = Date.now()
    const text = `login sexy,time:${now}`
    const encodedMessage = new TextEncoder().encode(text)
    const signMessage = await walletProvider!.signMessage(encodedMessage)
    // console.log('signMessage:', signMessage)

    const b64encoded = await bufferToBase64(signMessage)
    // console.log(b64encoded)

    const v = await httpGet('/account/token', {
        address,
        signature: b64encoded,
        time: now
    })

    window.localStorage.setItem('sex-ui', v.data)

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