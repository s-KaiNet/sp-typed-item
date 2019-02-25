import chalk from 'chalk';

import { Logger } from './Logger';

// tslint:disable:no-console

export class ConsoleLogger extends Logger {
    public error(err: any): void {
        console.log(chalk.red(this.data2String(err)));
    }

    public warn(data: string): void {
        console.log(chalk.yellow(data));
    }

    public info(data: string): void {
        console.log(data);
    }
}
