export function ensureTrailingSlash(url: string): string {
    if (!url.endsWith('/')) {
        return url + '/';
    }

    return url;
}
