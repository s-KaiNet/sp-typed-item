import { Logger } from './Logger';
import { VSCodeLogger } from './VSCodeLogger';
import { ConsoleLogger } from './ConsoleLogger';
import { VSCODE_INDICATOR } from '../Common/Consts';

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
        return !!process.env[VSCODE_INDICATOR];
    }
}
