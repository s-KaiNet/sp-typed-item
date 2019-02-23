import chalk from 'chalk';

import { Logger } from './Logger';

// tslint:disable:no-console

export class ConsoleLogger implements Logger {
    public error(err: any): void {
        console.log(chalk.red(err));
    }

    public log(data: string): void {
        console.log(data);
    }

}
