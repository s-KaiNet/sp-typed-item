import { Logger } from './Logger';
import { VSCodeLogger } from './VSCodeLogger';
import { ConsoleLogger } from './ConsoleLogger';

export class LogManager {

    private static logger: Logger;

    private constructor() { }

    public static get instance(): Logger {
        if (!LogManager.logger) {
            LogManager.logger = new ConsoleLogger();
        }

        return LogManager.logger;
    }
}
