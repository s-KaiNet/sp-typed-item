export function removeSlashes(url: string): string {
    if (!url) {
        return url;
    }

    return url.replace(/^\/+|\/+$/g, '');
}

export function removeExtraSymbols(name: string): string {
    if (!name) {
        return name;
    }

    return name.replace(/[_ ]/gi, '');
}

export function sanitizeUrl(name: string): string {
    if (!name) {
        return name;
    }

    return removeExtraSymbols(decodeURI(name));
}
