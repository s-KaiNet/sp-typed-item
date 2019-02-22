import { Logger } from './logger';

export class VSCodeLogger implements Logger {
    public error(err: any): void {
        throw new Error('Not implemented');
    }

    public log(data: string): void {
        throw new Error('Not implemented');
    }
}
