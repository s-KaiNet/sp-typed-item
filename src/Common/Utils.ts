export function removeSlashes(url: string): string {
    if (!url) {
        return url;
    }

    return url.replace(/^\/+|\/+$/g, '');
}
