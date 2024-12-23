const SEX_FI_LAUNCHED_LIST_KEY = 'SEX_FI_LAUNCHED_LIST'
const SEX_FI_LAUNCHED_LIST_TIME = 'SEX_FI_LAUNCHED_LIST_TIME'
const TIME_DURATION = 1000 * 60 * 60

export function getAll(type: string) {
    if (!checkTimeExpired(type)) {
        return
    }

    const listStr = window.localStorage.getItem(SEX_FI_LAUNCHED_LIST_KEY + '_' + type)
    if (listStr) {
        try {
            return JSON.parse(listStr)
        } catch(e) {
            console.log('getAll list:', e)
        }
    }

    return []
}

export function setAll(list: any, type: string) {
    if (list) {
        try {
            window.localStorage.setItem(SEX_FI_LAUNCHED_LIST_KEY + '_' + type , JSON.stringify(list))
            setTime(type)
        } catch(e) {
            console.log('setAll list:', e)
        }
    }
    return true
}

export function clearAll(type: string) {
    window.localStorage.removeItem(SEX_FI_LAUNCHED_LIST_KEY + '_' + type)
    window.localStorage.removeItem(SEX_FI_LAUNCHED_LIST_TIME + '_' + type)
}

function setTime(type: string) {
    window.localStorage.setItem(SEX_FI_LAUNCHED_LIST_TIME + '_' + type, Date.now().toString())
}

function checkTimeExpired(type: string) {
    const time = window.localStorage.getItem(SEX_FI_LAUNCHED_LIST_TIME + '_' + type)
    if (time) {
        if (Date.now() - Number(time) > TIME_DURATION) {
            return false
        }

        return true
    }

    return false
}