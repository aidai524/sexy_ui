import Big from "big.js";

export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function safeJSONStringify(obj: any): string | undefined {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error("safeJSONStringify", e);
    return undefined;
  }
}

export function safeJSONParse<T>(str: string): T | undefined {
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    console.error("safeJSONParse", e);
    return undefined;
  }
}

export function storageStore(
  namespace?: string,
  options?: { storage?: Storage }
) {
  if (typeof window === "undefined") return;
  const _namespace = namespace || "default";
  const storage = options?.storage || window?.localStorage;
  const namespaceKey = (key: string) => {
    return _namespace + ":" + key;
  };
  return {
    set(key: string, value: any) {
      const _value = safeJSONStringify(value);
      _value
        ? storage.setItem(namespaceKey(key), _value)
        : storage.removeItem(namespaceKey(key));
    },
    get<T>(key: string) {
      const _value = storage.getItem(namespaceKey(key));
      return _value ? safeJSONParse<T>(_value) : undefined;
    },
    remove(key: string) {
      storage.removeItem(namespaceKey(key));
    },
    clearAll: function clearAll() {
      for (const key in storage) {
        if (key.startsWith(namespace + ":")) {
          storage.removeItem(key);
        }
      }
    }
  };
}

export function generateUrl(
  url = "",
  query: Record<string, any>,
  hashes: Record<string, any> = {}
) {
  const queryStringParts = [];
  for (const key in query) {
    const value = query[key];
    if ([undefined, null, ""].includes(value)) continue;
    if (Array.isArray(value)) {
      value.forEach((_value) => {
        queryStringParts.push(
          encodeURIComponent(key) + "[]=" + encodeURIComponent(_value)
        );
      });
    } else {
      queryStringParts.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(value)
      );
    }
  }
  const queryString = queryStringParts.join("&");
  if (queryString) {
    url += url.includes("?") ? "&" : "?";
    url += queryString;
  }

  const hashStringParts = [];
  for (const key in hashes) {
    const value = hashes[key];
    if ([undefined, null, ""].includes(value)) continue;
    hashStringParts.push(
      encodeURIComponent(key) + "=" + encodeURIComponent(value)
    );
  }
  const hashString = hashStringParts.join("&");
  if (hashString) {
    url += "#" + hashString;
  }

  return url;
}

export function formatLongText(
  text?: string,
  front: number = 4,
  ending: number = 2
) {
  if (!text) return text;
  if (text.length <= front + ending) {
    return text;
  }
  return `${text.slice(0, front)}...${text.slice(-ending)}`;
}

export const addThousandSeparator = (numberString: string) => {
  if (!numberString) return "";
  const parts = String(numberString).split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimalPart = parts[1] ? `.${parts[1]}` : "";
  return integerPart + decimalPart;
};

export const numberFormatter = (
  value: string | number | Big.Big | undefined,
  precision: number,
  isSimple?: boolean,
  options?: {
    // resolve the issue of displaying values like $< 0.01
    // it should display as < $0.01
    prefix?: string;
    // when it is less than a certain value
    // 0 should be displayed in the integer part
    // not in the decimal part
    isLTIntegerZero?: boolean;
    // should zeros be added at the end
    isZeroPrecision?: boolean;
    isShort?: boolean;
    isShortUppercase?: boolean;
    round?: Big.RoundingMode;
  }
): any => {
  const {
    prefix = "",
    isLTIntegerZero,
    isZeroPrecision,
    isShort,
    isShortUppercase,
    round = Big.roundHalfUp
  } = options || {};

  const isValid = () => {
    try {
      if (!value) return false;
      Big(value);
      return true;
    } catch (err: any) {
      return false;
    }
  };

  if (!value || !isValid() || Big(value).eq(0)) {
    if (isSimple) {
      if (isZeroPrecision) {
        return `${prefix}${Big(0).toFixed(precision, round)}`;
      }
      return `${prefix}0`;
    }
    if (isZeroPrecision) {
      return {
        integer: `${prefix}0`,
        decimal: Big(0).toFixed(precision, round).replace(/^\d/, "")
      };
    }
    return {
      integer: `${prefix}0`,
      decimal: ""
    };
  }

  if (Big(value).lt(Big(10).pow(-precision))) {
    if (isSimple) {
      return `< ${prefix}${Big(10).pow(-precision).toFixed(precision, round)}`;
    }
    if (isLTIntegerZero) {
      return {
        integer: `< ${prefix}0`,
        decimal: Big(10)
          .pow(-precision)
          .toFixed(precision, round)
          .replace(/^\d/, "")
      };
    }
    return {
      integer: "",
      decimal: `< ${prefix}${Big(10).pow(-precision).toFixed(precision, round)}`
    };
  }

  const finalValue = addThousandSeparator(Big(value).toFixed(precision, round));
  const firstPart = finalValue.split(".")[0];
  let secondPart = finalValue.split(".")[1] || "";
  if (secondPart) {
    secondPart = "." + secondPart;
  }
  if (isSimple) {
    if (isShort) {
      const formatter = (split: number, unit: string): string => {
        const _num = Big(value)
          .div(split)
          .toFixed(precision, 0)
          .replace(/(?:\.0*|(\.\d+?)0+)$/, "$1");
        const inter = _num.split(".")?.[0]?.replace(/\d(?=(\d{3})+\b)/g, "$&,");
        const decimal = _num.split(".")?.[1] ?? "";
        return `${prefix}${inter}${decimal ? "." + decimal : ""}${unit}`;
      };
      if (Big(value).gte(1e9)) {
        return formatter(1e9, isShortUppercase ? "B" : "b");
      }
      if (Big(value).gte(1e6)) {
        return formatter(1e6, isShortUppercase ? "M" : "m");
      }
      if (Big(value).gte(1e3)) {
        return formatter(1e3, isShortUppercase ? "K" : "k");
      }
    }
    if (isZeroPrecision) {
      return `${prefix}${firstPart}${secondPart}`;
    }
    return `${prefix}${firstPart}${secondPart.replace(/[.]?0*$/, "")}`;
  }
  if (isZeroPrecision) {
    return {
      integer: `${prefix}${firstPart}`,
      decimal: secondPart
    };
  }
  return {
    integer: `${prefix}${firstPart}`,
    decimal: secondPart.replace(/[.]?0*$/, "")
  };
};

export const numberRemoveEndZero = (value: string) => {
  return value.replace(/\.?0+$/, "");
};
