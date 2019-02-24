import { Logger } from './Logger';

// tslint:disable:no-console

export class VSCodeLogger implements Logger {
    public error(err: any): void {
        throw new Error('Not implemented');
    }

    public log(data: string): void {
        console.log(data);
    }
}
