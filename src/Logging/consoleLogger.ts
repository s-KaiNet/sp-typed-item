import chalk from 'chalk';

import { Logger } from './Logger';

export class ConsoleLogger implements Logger {
    public error(err: any): void {
        console.error(chalk.red(err));
    }

    public log(data: string): void {
        console.log(data);
    }

}
