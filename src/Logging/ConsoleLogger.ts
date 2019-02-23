import chalk from 'chalk';

import { Logger } from './Logger';

// tslint:disable:no-console

export class ConsoleLogger implements Logger {
    public error(err: any): void {
        console.log(chalk.red(err));

        if (err && err.stack) {
            console.log('');
            console.log('Stack Trace:');
            console.log(chalk.red(err.stack));
        }
    }

    public log(data: string): void {
        console.log(data);
    }

}
