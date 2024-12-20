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

export function formatLongText(text?: string, front: number = 4, ending: number = 2) {
  if (!text) return text;
  if (text.length <= front + ending) {
    return text;
  }
  return `${text.slice(0, front)}...${text.slice(-ending)}`;
}
