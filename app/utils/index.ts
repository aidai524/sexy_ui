import dayjs from "./dayjs";
import type { Project } from "../type";
import { fail } from "./toast";
import { clearAll } from "./listStore";
import { Connection } from "@solana/web3.js";
// import Cropper from "cropperjs";
// @ts-ignore
import Croppie from "croppie";
import Big from "big.js";
import { deleteCookie } from "./common";
import { imgReg, videoReg } from "../components/upload";

const BASE_URL =
  process.env.NEXT_PUBLIC_API || "https://api.dumpdump.fun/api/v1";
const TOKEN_ERROR_CODE = -401;
// const BASE_URL = '/api/v1'

const AUTH_KEY = "sex-ui-auth";

export async function http(
  path: string,
  method: string,
  params?: any,
  headers?: any,
  isRepeat?: boolean
) {
  if (!path) return;
  let _path = path,
    postBody = {};
  if (method === "GET" && params) {
    const _paramsString = Object.keys(params)
      .map((key) => {
        return `${key}=${encodeURIComponent(params[key])}`;
      })
      .join("&");
    if (path.indexOf("?") > -1) {
      _path = `${_path}&${_paramsString}`;
    } else {
      _path = `${_path}?${_paramsString}`;
    }
  } else if (method === "POST") {
    postBody = {
      body: JSON.stringify(params)
    };
  }

  let _header = headers
    ? {
        headers: headers
      }
    : {
        headers: {
          authorization: getAuthorizationByLocal()
        }
      };

  const response = await fetch(`${BASE_URL}${_path}`, {
    method: method,
    ...postBody,
    ..._header
  });
  const data = await response.json();
  if (typeof data?.code === "undefined") return data;

  if (data.code === TOKEN_ERROR_CODE) {
    if (!window.connecting) {
      window.connect();
      window.localStorage.removeItem(AUTH_KEY);
    }
    if (isRepeat) {
      return await http(path, method, params, headers, false);
    }
    return data;
  }
  if (data.code !== 0) {
    return data;
  } else {
    return data;
  }
}

export async function httpGet(
  path: string,
  params: any = {},
  isRepeat: boolean = true
): Promise<any> {
  return await http(path, "GET", params, null, isRepeat);
}

export async function httpAuthGet(
  path: string,
  params: any = {},
  isRepeat: boolean = true
): Promise<any> {
  const authorization = await getAuthorization();
  if (!authorization) {
    return {
      code: -1,
      data: null
    };
  }
  return await http(
    path,
    "GET",
    params,
    {
      authorization
    },
    isRepeat
  );
}

export async function httpAuthPost(
  path: string,
  params: any = {},
  isRepeat: boolean = true,
  isJson?: boolean
) {
  const authorization = await getAuthorization();

  return await http(
    path,
    "POST",
    params,
    isJson
      ? {
          authorization,
          "Content-Type": "application/json"
        }
      : { authorization },
    isRepeat
  );
}

export async function httpAuthDelete(
  path: string,
  params: any = {},
  isRepeat: boolean = true
) {
  const authorization = await getAuthorization();

  return await http(
    path,
    "DELETE",
    params,
    {
      authorization
    },
    isRepeat
  );
}

export async function httpAuthPut(
  path: string,
  params: any = {},
  isRepeat: boolean = true
) {
  const authorization = await getAuthorization();

  return await http(
    path,
    "PUT",
    params,
    {
      authorization
    },
    isRepeat
  );
}

export async function bufferToBase64(buffer: Uint8Array) {
  const base64url: any = await new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result);
    reader.readAsDataURL(new Blob([buffer]));
  });
  return base64url.slice(base64url.indexOf(",") + 1);
}

let authorization: string | undefined;
const watingQuene: any[] = [];

// const rejectDuration = 1000 * 30;
// let rejectTime = Date.now() - rejectDuration - 1;

export async function getAuthorization() {
  authorization = getAuthorizationByLocal();

  if (!authorization) {
    if (window?.isInitingAuthorization) {
      return new Promise((resolve, reject) => {
        watingQuene.push(resolve);
      });
    } else {
      // await initAuthorization();
    }
  }

  return authorization;
}

export function getAuthorizationByLocal() {
  const auth = window.localStorage.getItem(AUTH_KEY)?.toString();
  return auth;
}

export async function getAuthorizationByLocalAndServer() {
  const auth = window.localStorage.getItem(AUTH_KEY)?.toString();
  if (auth) {
    const val = await httpGet("/project/list?limit=1&launchType=preLaunch");

    if (val.code === TOKEN_ERROR_CODE) {
      return null;
    }
  }

  return auth;
}

export function removeAuth() {
  window.localStorage.removeItem(AUTH_KEY);
}

export async function initAuthorization() {
  // if (getAuthorizationByLocal()) {
  //   return
  // }
  // if (Date.now() - rejectTime < rejectDuration) {
  //   return;
  // }

  if (window?.isInitingAuthorization) {
    return;
  }
  // @ts-ignore
  const { walletProvider, sexAddress, connect } = window;

  if (!walletProvider || !sexAddress) {
    // await connect();
    return;
  }

  window.isInitingAuthorization = true;

  const now = Date.now();
  const text = `login FlipN,time:${now}`;
  const encodedMessage = new TextEncoder().encode(text);
  try {
    const signMessage = await walletProvider!.signMessage(encodedMessage);
    const b64encoded = await bufferToBase64(signMessage);

    const v = await httpGet("/account/token", {
      address: sexAddress,
      signature: b64encoded,
      time: now
    });

    if (v.data) {
      window.localStorage.setItem(AUTH_KEY, v.data);
    } else {
      return;
    }

    authorization = v.data;

    while (watingQuene.length) {
      const _reslove = watingQuene.shift();
      _reslove(v.data);
    }
  } catch (e) {
    while (watingQuene.length) {
      const _reslove = watingQuene.shift();
      _reslove(null);
    }
    watingQuene.length = 0;
    window.disconnect?.();
    logOut();
  }

  window.isInitingAuthorization = false;
}

export function logOut() {
  window.walletProvider = null;
  window.sexAddress = undefined;
  window.localStorage.removeItem(AUTH_KEY);
  deleteCookie("referral");
  authorization = undefined;
  watingQuene.length = 0;
}

export function getFullNum(value: any) {
  try {
    let x = value;
    if (Math.abs(x) < 1.0) {
      const e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      let e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    return x;
  } catch (e) {}

  return value;
}

export function sleep(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export function formatAddress(address: string, len?: number) {
  if (!address) {
    return "";
  }
  const _len = len || 5;
  return (
    address.slice(0, _len) +
    "...." +
    address.slice(address.length - _len, address.length)
  );
}

const addressLastReg = /(\w{35}).+(\w{1})/;
export function formatAddressLast(address: string) {
  if (!address) {
    return "";
  }

  if (address.length > 12) {
    return address.replace(addressLastReg, ($1, $2, $3) => {
      return $2 + "...." + $3;
    });
  }
}

export function formatDateTimeAndAgo(time: number) {
  if (!time) {
    return "";
  }

  if (new Date(time).getDate() === new Date().getDate()) {
    return formatDateTime(time, "hh:mm:ss");
  } else {
    return timeAgo(time);
  }
}

export function formatDateTime(
  _datetime: any,
  formatStr: string = "YYYY-MM-DD hh:mm:ss"
) {
  if (!_datetime) return "";
  const datetime = new Date(_datetime);
  const values: any = {
    "M+": datetime.getMonth() + 1,
    "D+": datetime.getDate(),
    "h+": datetime.getHours(),
    "m+": datetime.getMinutes(),
    "s+": datetime.getSeconds(),
    S: datetime.getMilliseconds()
  };
  let fmt = formatStr;
  const reg = /(Y+)/;
  if (reg.test(fmt)) {
    const y = (reg.exec(fmt) as string[])[1];
    fmt = fmt.replace(y, (datetime.getFullYear() + "").substring(4 - y.length));
  }
  for (const k in values) {
    const regx = new RegExp("(" + k + ")");
    if (regx.test(fmt)) {
      const t = (regx.exec(fmt) as string[])[1];
      fmt = fmt.replace(
        t,
        t.length === 1
          ? values[k]
          : ("00" + values[k]).substring(("" + values[k]).length)
      );
    }
  }
  return fmt;
}
export function base64ToBlob(base64Data: string) {
  const dataArr: any = base64Data.split(",");
  const imageType = dataArr[0].match(/:(.*?);/)[1];
  const textData = window.atob(dataArr[1]);
  const arrayBuffer = new ArrayBuffer(textData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < textData.length; i++) {
    uint8Array[i] = textData.charCodeAt(i);
  }
  return [new Blob([arrayBuffer], { type: imageType }), imageType.slice(6)];
}

export async function upload(
  fileName: string,
  file: File,
  isImage: boolean = true,
  percent = 1.5,
  scala = 2,
  cropper = false
) {
  let _file: any = file;

  if (isImage && !cropper) {
    const url = await new Promise<string | void>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result;
        if (typeof res !== "string") return resolve();
        resolve(res);
      };
      reader.readAsDataURL(file);
    });
    if (!url) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const [naturalWidth, naturalHeight] = await new Promise<[number, number]>(
      (resolve) => {
        img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
        img.src = url;
      }
    );

    if (percent === 0) {
      const canvasWidth = 128 * scala;
      const canvasHeight = canvasWidth * 1.5;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      let scale = Math.min(
        canvasWidth / naturalWidth,
        canvasHeight / naturalHeight
      );
      let newWidth = naturalWidth * scale;
      let newHeight = naturalHeight * scale;
      let x = (canvasWidth - newWidth) / 2;
      let y = (canvasHeight - newHeight) / 2;

      ctx.drawImage(img, x, y, newWidth, newHeight);
    } else if (percent > 0) {
      const targetAspectRatio = 1 / percent;
      let cropWidth, cropHeight;

      if (naturalWidth / naturalHeight > targetAspectRatio) {
        cropHeight = naturalHeight;
        cropWidth = cropHeight * targetAspectRatio;
      } else {
        cropWidth = naturalWidth;
        cropHeight = cropWidth / targetAspectRatio;
      }

      const cropX = (naturalWidth - cropWidth) / 2;
      const cropY = (naturalHeight - cropHeight) / 2;

      const canvasWidth = 128 * scala;
      const canvasHeight = canvasWidth * percent;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      );
    } else {
      const scale = Math.min(800 / img.width, 800 / img.height);
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);
    }

    const base64Url = canvas.toDataURL("image/webp");
    const bloBData = base64ToBlob(base64Url);
    _file = bloBData[0];
  }

  const newFileName = generateRandomString(5);
  const fileExt = fileName?.split(".").pop() || "";
  const finalFileName = `${newFileName}${fileExt ? "." + fileExt : ""}`;

  return postUpload(_file, finalFileName, file.type);
}

const s3_dir = process.env.NEXT_PUBLIC_S3_DIR || "flipn/stg/";

export async function postUpload(
  _file: any,
  newFileName: string,
  type: string
) {
  try {
    const val = await httpAuthPost(
      `/upload/data?dir=${encodeURIComponent(s3_dir)}&file_name=${newFileName}`
    );
    if (val?.code === 0) {
      const res = await fetch(val.data, {
        method: "PUT",
        body: _file,
        headers: {
          "Content-Type": type
        }
      });

      if (!res.ok) {
        fail("Upload fail");
        return null;
      }

      console.log(
        `${process.env.NEXT_PUBLIC_S3_URL_PREFIX}/${s3_dir}${newFileName}`
      );

      return `${process.env.NEXT_PUBLIC_S3_URL_PREFIX}/${s3_dir}${newFileName}`;
    }
  } catch (e) {
    fail("Upload fail");
    console.log(e);
  }

  return null;
}

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function timeAgo(time?: number, currentTime?: number) {
  if (!time) {
    return;
  }

  const date = new Date(time);

  const now = currentTime ? new Date(currentTime) : new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000); // months
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400); // days
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }
  interval = Math.floor(seconds / 3600); // hours
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }
  interval = Math.floor(seconds / 60); // minutes
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }
  return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
}

export function formatDateEn(time: number, format: string = "MMM D, YYYY") {
  const date = dayjs(time);
  return date.format(format);
}

export function getDeviceType() {
  if (typeof window === "undefined")
    return { pc: true, ios: false, android: false, mobile: false };
  const userAgent = navigator.userAgent || navigator.vendor;

  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isMobile =
    /Mobile|Tablet|iPad|iPhone|iPod|Android/i.test(userAgent) ||
    window.innerWidth < 640;

  return {
    pc: !isAndroid && !isIOS && !isMobile,
    ios: isIOS,
    android: isAndroid,
    mobile: isMobile
  };
}

export function formatSortAddress(address: string | undefined) {
  if (!address) return "";

  const domainSuffixes = [".near", ".testnet", ".betanet", ".mainnet"];
  const maxLength = 12;

  const suffix = domainSuffixes.find((suffix) => address.endsWith(suffix));
  const isLongAddress = address.length > maxLength;

  if (suffix) {
    if (isLongAddress) {
      const visiblePartLength = maxLength - suffix.length - 10;
      if (visiblePartLength > 0) {
        return `${address.slice(0, 6)}...${address.slice(
          -4 - suffix.length,
          -suffix.length
        )}${suffix}`;
      } else {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      }
    } else {
      return address;
    }
  } else {
    return isLongAddress
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;
  }
}

export const simplifyNum = (number: number, precision: number = 0) => {
  if (typeof Number(number) !== "number") return 0;
  if (isNaN(Number(number))) return 0;

  if (number === 0) {
    return "0";
  }

  if (number < 0.01) {
    return "<0.01";
  }

  let str_num;
  if (number >= 1e3 && number < 1e6) {
    str_num = number / 1e3;
    return new Big(str_num).toFixed(precision, 0) + "K";
  } else if (number >= 1e6) {
    str_num = number / 1e6;
    return new Big(str_num).toFixed(precision, 0) + "M";
  } else {
    return Number(number).toFixed(2);
  }
};

export function isValidURL(url: string) {
  const regex = /^https?:\/\/([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?(\?.*)?$/i;
  return regex.test(url);
}

export async function getTransaction(
  connection: Connection,
  hash: string,
  tokenAddress: string,
  userAddress: string
) {
  const transactionDetails = await connection.getTransaction(hash, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0
  });

  if (transactionDetails?.meta) {
    const { preTokenBalances, postTokenBalances } = transactionDetails?.meta;

    const toeknAddress = tokenAddress;
    const preToken = preTokenBalances?.find(
      (item) => item.mint === toeknAddress && item.owner === userAddress
    );
    const postToken = postTokenBalances?.find(
      (item) => item.mint === toeknAddress && item.owner === userAddress
    );

    if (postToken) {
      const preAmount = preToken ? preToken.uiTokenAmount.amount : 0;
      const result = new Big(postToken.uiTokenAmount.amount)
        .minus(preAmount)
        .toFixed(0);
      return result;
    }
  }

  return null;
}

export async function getPointByVolume(volume: string, type: "sexy" | "pump") {
  const params =
    type === "sexy"
      ? { sexy_volume: volume, pump_volume: 0 }
      : { pump_volume: volume, sexy_volume: 0 };
  return httpGet("/mining/swapEstimate", params).then((res) => res.data);
}

export function formatNumberWithCommas(num: string | number) {
  if (typeof num === "number") {
    num = num.toString();
  }

  const parts = num.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function checkFileType(file: string): "image" | "video" | null {
  if (videoReg.test(file)) {
    return "video";
  } else if (imgReg.test(file)) {
    return "image";
  }
  return null;
}
