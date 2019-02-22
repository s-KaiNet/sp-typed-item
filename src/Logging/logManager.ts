import { Logger } from './logger';
import { VSCodeLogger } from './vscodeLogger';
import { ConsoleLogger } from './consoleLogger';

export class LogManager {

    private static logger: Logger;

    private constructor() { }

    public static get instance(): Logger {
        if (!LogManager.logger) {
            if (LogManager.isVSCode()) {
                LogManager.logger = new VSCodeLogger();
            } else {
                LogManager.logger = new ConsoleLogger();
            }
        }

        return LogManager.logger;
    }

    private static isVSCode(): boolean {
        return !!process.env['SP_ITEM_VSCODE'];
    }
}
