import * as mkdrip from 'mkdirp';
import * as rimraf from 'rimraf';

export function removeSlashes(url: string): string {
    if (!url) {
        return url;
    }

    return url.replace(/^\/+|\/+$/g, '');
}

export async function addDirectory(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
        mkdrip(dir, (err: any) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

export async function removeDirectory(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
        rimraf(dir, (err: any) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}
