export function shareToX(name: string, link: string) {
    window.open(
        `https://twitter.com/intent/tweet?text=${name}&url=${encodeURIComponent(link)}`
    );
}