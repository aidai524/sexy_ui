import { Toast } from 'antd-mobile'

export function success(msg: string) {
    Toast.show({
        content: msg,
        position: 'top',
        icon: 'success',
        duration: 5000
    })
}

export function fail(msg: string) {
    Toast.show({
        content: msg,
        position: 'top',
        icon: 'fail',
        duration: 5000
    })
}