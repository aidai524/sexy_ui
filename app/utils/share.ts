export function shareToX(name: string, link: string) {
    window.open(
        `https://twitter.com/intent/tweet?text=${name}&url=${encodeURIComponent(link)}`
    );
}

const short_prefix = 'https://s.flipn.fun/'

export async function getShortUrl(longUrl: string) {
    const res = await fetch(`${short_prefix}url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: longUrl})
    }).then(res => res.json())

    if (res.error) {
        throw 'Invalid long url'
    }

    return short_prefix + res.code
}