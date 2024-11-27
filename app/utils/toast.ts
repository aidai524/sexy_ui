import { Toast } from 'antd-mobile'

export function success(msg: string) {
    Toast.show({
        content: msg,
        position: 'top',
        icon: 'success'
    })
}

export function fail(msg: string) {
    Toast.show({
        content: msg,
        position: 'top',
        icon: 'fail'
    })
}