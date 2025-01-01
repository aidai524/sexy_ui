const SEX_FI_LAUNCHED_LIST_KEY = "SEX_FI_LAUNCHED_LIST";
const SEX_FI_LAUNCHED_LIST_TIME = "SEX_FI_LAUNCHED_LIST_TIME";
const TIME_DURATION = 1000 * 60 * 60;

export function getAll(type: string, account: string) {
  if (!checkTimeExpired(type) || !account) {
    return [];
  }

  const listStr = window.localStorage.getItem(
    SEX_FI_LAUNCHED_LIST_KEY + "_" + type + "_" + account
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
  if (!account) return;
  if (list) {
    try {
      window.localStorage.setItem(
        SEX_FI_LAUNCHED_LIST_KEY + "_" + type + "_" + account,
        JSON.stringify(list)
      );
      setTime(type);
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
  window.localStorage.removeItem(SEX_FI_LAUNCHED_LIST_TIME + "_" + type);
}

export function updateOneInList(item: any, account: string) {
  if (!item || !account) {
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

function setTime(type: string) {
  window.localStorage.setItem(
    SEX_FI_LAUNCHED_LIST_TIME + "_" + type,
    Date.now().toString()
  );
}

function checkTimeExpired(type: string) {
  const time = window.localStorage.getItem(
    SEX_FI_LAUNCHED_LIST_TIME + "_" + type
  );
  if (time) {
    if (Date.now() - Number(time) > TIME_DURATION) {
      return false;
    }

    return true;
  }

  return false;
}
