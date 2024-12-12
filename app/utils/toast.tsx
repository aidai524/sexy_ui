import { Toast } from 'antd-mobile'


export function success(msg: string) {
    Toast.show({
        content: <div style={{ color: '#AAFF00' }}>{msg}</div>,
        position: 'top',
        icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="13" stroke="#AAFF00" stroke-width="2" />
            <path d="M8.79999 13.5667L12.2667 17.0333L18.7667 10.5333" stroke="#AAFF00" stroke-width="3" stroke-linecap="round" />
        </svg>,
        duration: 2000
    })
}

export function fail(msg: string) {
    Toast.show({
        content: <div style={{ color: '#FF2681' }}>{msg}</div>,
        position: 'top',
        icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="13" stroke="#FF2681" stroke-width="2" stroke-linecap="round" />
            <path d="M14 7.5V14.8667" stroke="#FF2681" stroke-width="3" stroke-linecap="round" />
            <path d="M14 19.2V20.0666" stroke="#FF2681" stroke-width="3" stroke-linecap="round" />
        </svg>,
        duration: 2000
    })
}