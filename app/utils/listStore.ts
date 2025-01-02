const SEX_FI_LAUNCHED_LIST_KEY = "SEX_FI_LAUNCHED_LIST";
const SEX_FI_LAUNCHED_LIST_TIME = "SEX_FI_LAUNCHED_LIST_TIME";
const TIME_DURATION = 1000 * 60 * 60;
const DEFAULT_ACCOUNT = "flip";

export function getAll(type: string, account: string) {
  const _account = account || DEFAULT_ACCOUNT;
  if (!checkTimeExpired(type, _account)) {
    return [];
  }

  const listStr = window.localStorage.getItem(
    SEX_FI_LAUNCHED_LIST_KEY + "_" + type + "_" + _account
  );
  if (listStr) {
    try {
      return JSON.parse(listStr);
    } catch (e) {
      console.log("getAll list:", e);
    }
  }

  return [];
}

export function setAll(list: any, type: string, account: string) {
  const _account = account || DEFAULT_ACCOUNT;
  if (list) {
    try {
      window.localStorage.setItem(
        SEX_FI_LAUNCHED_LIST_KEY + "_" + type + "_" + _account,
        JSON.stringify(list)
      );
      setTime(type, _account);
    } catch (e) {
      console.log("setAll list:", e);
    }
  }
  return true;
}

export function clearAll(type: string, account: string) {
  window.localStorage.removeItem(
    SEX_FI_LAUNCHED_LIST_KEY + "_" + type + "_" + account
  );
  window.localStorage.removeItem(
    SEX_FI_LAUNCHED_LIST_TIME + "_" + type + "_" + account
  );
}

export function updateOneInList(item: any, account: string) {
  if (!item) {
    return;
  }

  let list = [];
  if (item.status === 0) {
    list = getAll("preLaunch", account);
  } else if (item.status === 1) {
    list = getAll("launching", account);
  }

  list.some((oldItem: any) => {
    if (oldItem.id === item.id) {
      Object.assign(oldItem, item);
      return true;
    }

    return false;
  });

  if (item.status === 0) {
    setAll(list, "preLaunch", account);
  } else if (item.status === 1) {
    setAll(list, "launching", account);
  }
}

function setTime(type: string, account: string) {
  window.localStorage.setItem(
    SEX_FI_LAUNCHED_LIST_TIME + "_" + type + "_" + account,
    Date.now().toString()
  );
}

function checkTimeExpired(type: string, account: string) {
  const time = window.localStorage.getItem(
    SEX_FI_LAUNCHED_LIST_TIME + "_" + type + "_" + account
  );
  if (time) {
    if (Date.now() - Number(time) > TIME_DURATION) {
      return false;
    }

    return true;
  }

  return false;
}
